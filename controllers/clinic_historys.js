const express = require('express');
const { check, validationResult } = require('express-validator');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const { ClinicHistory } = require('../models/db')
const { ErrorResult, Result, PagingResult } = require('../utils/base_response')
const router = express.Router();
router.use((req, res, next) => {
    next();
})

//fill ClinicHistorys apis here
router.get('/', (req, res) => {
    let page = 0;
    if (req.query.p) page = parseInt(req.query.p);
    let pageSize = 20;
    if (req.query.s) pageSize = parseInt(req.query.s);
    let queryString = '';
    if (req.query.q) queryString = '%' + decodeURIComponent(req.query.q) + '%';
    let sortColumn = 'id_Cli_his';
    let sortDirection = 'ASC';
    if (req.query.so) {
        const sortStr = decodeURIComponent(req.query.so).split(' ');
        sortColumn = sortStr[0];
        if (sortStr.length == 2) sortDirection = sortStr[1];
    }

    const offset = (page) * pageSize;
    if (queryString.length <= 2) {
        ClinicHistory.count().then(numRow => {
            const totalRows = numRow;
            const totalPages = Math.ceil(totalRows / pageSize);
            ClinicHistory.findAll({
                order: [
                    [sortColumn, sortDirection]
                ],
                offset: offset,
                limit: pageSize
            }).then(ClinicHistorys => {
                return res.json(PagingResult(ClinicHistorys, {
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
        //         ClinicHistoryName: {
        //             [Op.like]: queryString
        //         }
        //     }]
        // };
        ClinicHistory.count({ where: whereClause }).then(numRow => {
            const totalRows = numRow;
            const totalPages = Math.ceil(totalRows / pageSize);
            ClinicHistory.findAll({
                order: [
                    [sortColumn, sortDirection]
                ],
                where: whereClause,
                offset: offset,
                limit: pageSize
            }).then(ClinicHistorys => {
                return res.json(PagingResult(ClinicHistorys, {
                    pageNumber: page,
                    pageSize: pageSize,
                    totalRows: totalRows,
                    totalPages: totalPages
                }))
            })
        })
    }
});

router.get('/:id', (req, res) => {
    ClinicHistory.findByPk(req.params.id).then(type => {
        if (type != null) {
            res.json(Result(type))
        } else {
            res.status(404).json(ErrorResult(404, 'Not Found!'));
        }
    });
});

router.post('/', (req, res) => {
    ClinicHistory.create(req.body).then(type => {
        res.json(Result(type))
    }).catch(err => {
        return res.status(400).send(ErrorResult(400, err.errors));
    });
});

router.put('/:id', (req, res) => {
    ClinicHistory.findByPk(req.params.id).then(type => {
        if (type != null) {
            type.update({
                id_doc_shift: req.body.id_doc_shift,
                id_user: req.body.id_user
            }).then(type => {
                res.json(Result(type))
            }).catch(err => {
                return res.status(400).send(ErrorResult(400, err.errors));
            });
        } else {
            res.status(404).json(ErrorResult(404, 'Not Found!'));
        }
    });
});

router.delete('/:id', (req, res) => {
    ClinicHistory.destroy({
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