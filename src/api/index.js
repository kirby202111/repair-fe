//index.js不在vue组件实例上,没有this指针,不引入的话this访问不到vue对象
import request from "../utils/request"
export default {
    getRepairSymptomList(params) {
        return request({
            url: '/RepairSymptom/getRepairSymptomList',
            method: 'get',
            data: params,
        });
    },
    getAllRepairType(params) {
        return request({
            url: '/RepairSymptom/getAllRepairType',
            method: 'get',
            data: params,
        });
    },
    createRepairSymptom(params) {
        return request({
            url: '/RepairSymptom/createRepairSymptom',
            method: 'post',
            data: params,
        });
    },
    editRepairSymptom(params) {
        return request({
            url: '/RepairSymptom/editRepairSymptom',
            method: 'post',
            data: params,
        });
    },
    deleteRepairSymptom(params) {
        return request({
            url: '/RepairSymptom/deleteRepairSymptom',
            method: 'post',
            data: params,
        });
    },
    submitCompletedForm(params){
        return request({
            url: '/RepairSymptom/submitCompletedForm',
            method: 'post',
            data: params,
        });
    },
    createRepairDeal(params) {
        return request({
            url: '/RepairDeal/createRepairDeal',
            method: 'post',
            data: params,
        });
    },
    editRepairDeal(params) {
        return request({
            url: '/RepairDeal/editRepairDeal',
            method: 'post',
            data: params,
        });
    },
    deleteRepairDeal(params){
        return request({
            url: '/RepairDeal/deleteRepairDeal',
            method: 'delete',
            data: params,
        });
    },
    changeRepairState(params){
        return request({
            url: '/AuditLog/changeRepairState',
            method: 'post',
            data: params,
        });
    },

}