<template>
    <div class="user-manage">
        <div class="query-form">
            <el-form :inline="true" :model="queryForm" ref="queryRef">
                <el-form-item prop="productCode" label="流水号">
                    <el-input v-model="queryForm.productCode" placeholder="请输入流水号">
                    </el-input>
                </el-form-item>
                <el-form-item prop="applyState" label="维修单状态">
                    <el-select v-model="queryForm.applyState" placeholder="维修单状态">
                        <el-option :value="0" label="待审批"></el-option>
                        <el-option :value="1" label="审批中"></el-option>
                        <el-option :value="2" label="审批拒绝"></el-option>
                        <el-option :value="3" label="审批通过"></el-option>
                        <el-option :value="4" label="作废"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleQuery">查询</el-button>
                    <el-button @click="handleReset($event, queryRef)">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="base-table">
            <el-table :data="repairSymptomList">
                <el-table-column type="expand">
                    <template #default="props">
                        <el-table :data="props.row.RepairDeals">
                            <el-table-column label="类别" prop="TypeOfPart" />
                            <el-table-column label="部件" prop="Part" />
                            <el-table-column label="单元" prop="Unit" />
                            <el-table-column label="处理方法" prop="Treatment" />

                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
                    :width="item.width">
                </el-table-column>
                <el-table-column label="操作" width="350px" v-if="queryForm.applyState == 1">
                    <template #default="scope">
                        <el-button @click="dealReject(scope.row)">拒绝</el-button>
                        <el-button type="primary" @click="dealAccept(scope.row)">通过</el-button>
                        <el-button type="primary">审核</el-button>
                        <el-button type="danger" @click="handleDeleteSymptom(scope.row)">作废</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination" background layout="prev, pager, next" :total="pager.total"
                :page-size="pager.pageSize" @current-change="handleCurrentChange">
            </el-pagination>
                    <el-dialog title="不良处理项" v-model="showDealForm">
            <el-form :rules="dealRules" :model="repairDealForm" label-width="100px" ref="dealFormRef">
                <el-form-item label="产品类别" prop="TypeOfPart">
                    <el-select placeholder="请输入产品类别" v-model="repairDealForm.TypeOfPart">
                        <el-option label="板卡" :value=TypeOfPart.板卡 />
                        <el-option label="结构件" :value=TypeOfPart.结构件 />
                        <el-option label="组装部件" :value=TypeOfPart.组装部件 />
                    </el-select>
                </el-form-item>
                <el-form-item label="维修部件" prop="Part">
                    <el-input title="维修部件名" v-model="repairDealForm.Part"></el-input>
                </el-form-item>
                <el-form-item label="维修单元" prop="Unit">
                    <el-input title="维修单元名" v-model="repairDealForm.Unit"></el-input>
                </el-form-item>
                <el-form-item label="不良处理" prop="Treatment">
                    <el-input :rows="2" type="textarea" v-model="repairDealForm.Treatment"
                        placeholder="当前不良类别下对应的不良处理..."></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleCloseDealForm">拒绝</el-button>
                    <el-button type="primary" @click="handleSubmitDealForm">通过</el-button>
                </span>
            </template>
        </el-dialog>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, onMounted, watch } from 'vue';
const ctx = getCurrentInstance();
const queryRef = ref(null);
// const symptomFormRef = ref(null);
// const dealFormRef = ref(null);
const queryForm = reactive({
    productCode: "",
    applyType: null,
    applyState: 1,
});
watch(() => queryForm.applyState, () => {
    getRepairList();
})
const repairSymptomList = ref([]);
const columns = reactive([
    {
        label: "流水号",
        prop: "ProductCode"
    },
    {
        label: "申请人",
        prop: "CreatorUserName"
    },
    {
        label: "不良类别",
        prop: "RepairTypeName"
    },
    {
        label: "不良描述",
        prop: "RepairDescription"
    },
]);
const pager = {
    pageIndex: 1,
    pageSize: 10,  //每页10条
    total: 10,  //总页数
}
const handleReset = (_, ref) => {
    //element-ui添加prop可以获取表单的对象,显示表单中有哪些对象,校验也依赖prop
    ref.resetFields();
}
const handleQuery = () => {
    getRepairList();
}
const getRepairList = async () => {
    let params = { ...queryForm, ...pager };
    let { data } = await ctx.appContext.config.globalProperties.$api.getRepairSymptomList(params);
    repairSymptomList.value = data.Data.res;
    pager.total = data.Data.count;
}

//分页处理
const handleCurrentChange = (currentPage) => {
    pager.pageIndex = currentPage;
    getRepairList();
}

//维修描述项作废
const handleDeleteSymptom = async (row) => {
    console.log("row", row);
    let params = { Id: row.Id };
    let { data } = await ctx.appContext.config.globalProperties.$api.deleteRepairSymptom(params);
    if (data.Success == true) {
        ctx.appContext.config.globalProperties.$message.success(data.Message);
        getRepairList();
    } else {
        ctx.appContext.config.globalProperties.$message.error(data.Message);
    }
}

const dealReject = async (row) => {
    let params = {
        Id: row.Id,
        applyState: 2 //申请拒绝
    };
    let { data } = await ctx.appContext.config.globalProperties.$api.changeRepairState(params);
    addAuditLog(row.Id,"","审核拒绝");
    if (data.Success == true) {
        ctx.appContext.config.globalProperties.$message.success(data.Message);
        getRepairList();
    } else {
        ctx.appContext.config.globalProperties.$message.error(data.Message);
    }
}

const dealAccept = async (row) => {
    let params = {
        Id: row.Id,
        applyState: 3 //申请同意
    };
    let { data } = await ctx.appContext.config.globalProperties.$api.changeRepairState(params);
    addAuditLog(row.Id,"","审核通过");
    if (data.Success == true) {
        ctx.appContext.config.globalProperties.$message.success(data.Message);
        getRepairList();
    } else {
        ctx.appContext.config.globalProperties.$message.error(data.Message);
    }

}

const addAuditLog = async (RepairId,Remark,Action) => {
    let auditLog = {
        RepairId,
        Remark,
        Action
    };
    let { data } = await ctx.appContext.config.globalProperties.$api.changeRepairState(auditLog);
    if (data.Success == true) {
        ctx.appContext.config.globalProperties.$message.success(data.Message);
        getRepairList();
    } else {
        ctx.appContext.config.globalProperties.$message.error(data.Message);
    }
}
onMounted(() => {
    getRepairList();

});
</script>

<style>
</style>