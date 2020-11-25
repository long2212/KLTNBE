const express = require('express');
const { check, validationResult } = require('express-validator');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const { DoctorShift } = require('../models/db')
const { ErrorResult, Result, PagingResult } = require('../utils/base_response')
const router = express.Router();
router.use((req, res, next) => {
    next();
})

//fill DoctorShifts apis here
router.get('/', (req, res) => {
    let page = 0;
    if (req.query.p) page = parseInt(req.query.p);
    let pageSize = 20;
    if (req.query.s) pageSize = parseInt(req.query.s);
    let queryString = '';
    if (req.query.q) queryString = '%' + decodeURIComponent(req.query.q) + '%';
    let sortColumn = 'date';
    let sortDirection = 'ASC';
    if (req.query.so) {
        const sortStr = decodeURIComponent(req.query.so).split(' ');
        sortColumn = sortStr[0];
        if (sortStr.length == 2) sortDirection = sortStr[1];
    }

    const offset = (page) * pageSize;
    if (queryString.length <= 2) {
        DoctorShift.count().then(numRow => {
            const totalRows = numRow;
            const totalPages = Math.ceil(totalRows / pageSize);
            DoctorShift.findAll({
                order: [
                    [sortColumn, sortDirection]
                ],
                offset: offset,
                limit: pageSize,
                //include: [{ model: BookLending, as: 'bookLending' }, { model: BookItem, as: 'bookItem' }]
            }).then(DoctorShifts => {
                return res.json(PagingResult(DoctorShifts, {
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
        //             dueDate: {
        //                 [Op.like]: queryString
        //             }
        //         },
        //         {
        //             returnDate: {
        //                 [Op.like]: queryString
        //             }
        //         },
        //         {
        //             bookId: {
        //                 [Op.like]: queryString
        //             }
        //         },
        //         {
        //             lendingId: {
        //                 [Op.like]: queryString
        //             }
        //         }
        //     ]
        // };
        DoctorShift.count({ where: whereClause }).then(numRow => {
            const totalRows = numRow;
            const totalPages = Math.ceil(totalRows / pageSize);
            DoctorShift.findAll({
                where: whereClause,
                offset: offset,
                limit: pageSize,
                //include: [{ model: BookLending, as: 'bookLending' }, { model: BookItem, as: 'bookItem' }]
            }).then(DoctorShifts => {
                return res.json(PagingResult(DoctorShifts, {
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
    DoctorShift.findOne({
        where: { id: req.params.id },
        //include: [{ model: BookLending, as: 'bookLending' }, { model: BookItem, as: 'bookItem' }]
    }).then(DoctorShift => {
        if (DoctorShift != null) {
            return res.json(Result(DoctorShift));
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

    DoctorShift.create(req.body).then(DoctorShift => {
        return res.json(Result(DoctorShift))
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

    DoctorShift.findByPk(req.params.id).then(DoctorShift => {
        if (DoctorShift != null) {
            DoctorShift.update({
                id_doc: req.body.id_doc,
                id_shift: req.body.id_shift,
                id_s_type: req.body.id_s_type,
                id_room: req.body.id_room,
                date: req.body.date
            }).then(DoctorShift => {
                return res.json(Result(DoctorShift));
            }).catch(err => {
                return res.status(400).send(ErrorResult(400, err.errors));
            });
        } else {
            return res.status(404).send(ErrorResult(404, 'Not Found!'));
        }
    });
});

router.delete('/:id(\\d+)', (req, res) => {
    DoctorShift.destroy({
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