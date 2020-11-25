const express = require('express');
const { check, validationResult } = require('express-validator');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const { Room} = require('../models/db')
const { ErrorResult, Result, PagingResult } = require('../utils/base_response')
const router = express.Router();
router.use((req, res, next) => {
    next();
})

//fill Rooms apis here
router.get('/', (req, res) => {
    let page = 0;
    if (req.query.p) page = parseInt(req.query.p);
    let pageSize = 20;
    if (req.query.s) pageSize = parseInt(req.query.s);
    let queryString = '';
    if (req.query.q) queryString = '%' + decodeURIComponent(req.query.q) + '%';
    let sortColumn = 'id_spec';
    let sortDirection = 'ASC';
    if (req.query.so) {
        const sortStr = decodeURIComponent(req.query.so).split(' ');
        sortColumn = sortStr[0];
        if (sortStr.length == 2) sortDirection = sortStr[1];
    }

    const offset = (page) * pageSize;
    if (queryString.length <= 2) {
        Room.count().then(numRow => {
            const totalRows = numRow;
            const totalPages = Math.ceil(totalRows / pageSize);
            Room.findAll({
                order: [
                    [sortColumn, sortDirection]
                ],
                offset: offset,
                limit: pageSize,
                //include: [{ model: Book, as: 'book' }]
            }).then(Rooms => {
                return res.json(PagingResult(Rooms, {
                    pageNumber: page,
                    pageSize: pageSize,
                    totalRows: totalRows,
                    totalPages: totalPages
                }))
            })
        })
    } else { // search
        // conditions
        // const whereClause = {
        //     [Op.or]: [{
        //             createDate: {
        //                 [Op.like]: queryString
        //             }
        //         },
        //         {
        //             status: {
        //                 [Op.like]: queryString
        //             }
        //         },
        //         {
        //             isbn: {
        //                 [Op.like]: queryString
        //             }
        //         }
        //     ]
        // };
        Room.count({ where: whereClause }).then(numRow => {
            const totalRows = numRow;
            const totalPages = Math.ceil(totalRows / pageSize);
            Room.findAll({
                where: whereClause,
                offset: offset,
                limit: pageSize,
                //include: [{ model: Book, as: 'book' }]
            }).then(Rooms => {
                return res.json(PagingResult(Rooms, {
                    pageNumber: page,
                    pageSize: pageSize,
                    totalRows: totalRows,
                    totalPages: totalPages
                }))
            })
        })
    }
});

router.get('/:id(\\d+)', (req, res) => {
    Room.findOne({
        where: { id: req.params.id },
        include: [{ model: Book, as: 'book' }]
    }).then(Room => {
        if (Room != null) {
            return res.json(Result(Room));
        } else {
            return res.status(404).json(ErrorResult(404, 'Not Found!'));
        }
    });
});

router.post('/', [
    // check('CUT_ID', 'Invalid number').isNumeric(),
    // check('name', 'Length from 2 to 100').isLength({ min: 2, max: 100 }),
    // check('email', 'Invalid email').isEmail(),
    // check('address', 'Required').not().isEmpty()
], (req, res) => {
    //validate data here
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(ErrorResult(422, errors.array()));
    }

    Room.create(req.body).then(Room => {
        return res.json(Result(Room))
    }).catch(err => {
        return res.status(400).send(ErrorResult(400, err.errors));
    });
});

router.put('/:id(\\d+)', [
    // check('CUT_ID', 'Invalid number').isNumeric(),
    // check('name', 'Length from 2 to 100').isLength({ min: 2, max: 100 }),
    // check('email', 'Invalid email').isEmail(),
    // check('address', 'Required').not().isEmpty()
], (req, res) => {
    //validate data here
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(ErrorResult(422, errors.array()));
    }

    Room.findByPk(req.params.id).then(Room => {
        if (Room != null) {
            Room.update({
                id_spec: req.body.id_spec,
                name: req.body.name
            }).then(Room => {
                return res.json(Result(Room));
            }).catch(err => {
                return res.status(400).send(ErrorResult(400, err.errors));
            });
        } else {
            return res.status(404).send(ErrorResult(404, 'Not Found!'));
        }
    });
});

router.delete('/:id(\\d+)', (req, res) => {
    Room.destroy({
        where: {
            id: req.params.id
        }
    }).then(type => {
        res.json(Result(type))
    }).catch(err => {
        return res.status(500).send(ErrorResult(500, err.errors));
    });
});


module.exports = router;