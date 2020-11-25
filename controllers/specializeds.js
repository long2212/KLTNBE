const express = require('express');
const { check, validationResult } = require('express-validator');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const { Specialized} = require('../models/db')
const { ErrorResult, Result, PagingResult } = require('../utils/base_response')
const router = express.Router();
router.use((req, res, next) => {
    next();
})

//fill Specializeds apis here
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
        Specialized.count().then(numRow => {
            const totalRows = numRow;
            const totalPages = Math.ceil(totalRows / pageSize);
            Specialized.findAll({
                order: [
                    [sortColumn, sortDirection]
                ],
                offset: offset,
                limit: pageSize,
                //include: [{ model: Member, as: 'member' }]
            }).then(Specializeds => {
                return res.json(PagingResult(Specializeds, {
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
        //             id_spec: {
        //                 [Op.like]: queryString
        //             }
        //         },
        //         {
        //             name: {
        //                 [Op.like]: queryString
        //             }
        //         },
        //         {
        //             regional: {
        //                 [Op.like]: queryString
        //             }
        //         }
        //     ]
        // };
        Specialized.count({ where: whereClause }).then(numRow => {
            const totalRows = numRow;
            const totalPages = Math.ceil(totalRows / pageSize);
            Specialized.findAll({
                where: whereClause,
                offset: offset,
                limit: pageSize,
                //include: [{ model: Member, as: 'member' }]
            }).then(Specializeds => {
                return res.json(PagingResult(Specializeds, {
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
    Specialized.findOne({
        where: { id: req.params.id },
        //include: [{ model: Member, as: 'member' }]
    }).then(Specialized => {
        if (Specialized != null) {
            return res.json(Result(Specialized));
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

    Specialized.create(req.body).then(Specialized => {
        return res.json(Result(Specialized))
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

    Specialized.findByPk(req.params.id).then(Specialized => {
        if (Specialized != null) {
            Specialized.update({
                name: req.body.name,
                regional: req.body.regional
            }).then(Specialized => {
                return res.json(Result(Specialized));
            }).catch(err => {
                return res.status(400).send(ErrorResult(400, err.errors));
            });
        } else {
            return res.status(404).send(ErrorResult(404, 'Not Found!'));
        }
    });
});

router.delete('/:id(\\d+)', (req, res) => {
    Specialized.destroy({
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