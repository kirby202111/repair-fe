<template>
    <div class="user-manage">
        <div class="query-form">
            <el-form :inline="true" :model="queryForm" ref="queryRef">
                <el-form-item prop="productCode" label="流水号">
                    <el-input v-model="queryForm.productCode" placeholder="请输入流水号">
                    </el-input>
                </el-form-item>
                <el-form-item prop="applyType" label="维修单类型">
                    <el-select v-model="queryForm.applyType" placeholder="维修类型">
                        <el-option :value=ApplyType.SMT label="SMT"></el-option>
                        <el-option :value=ApplyType.THT label="THT"></el-option>
                        <el-option :value=ApplyType.半成品测试 label="半成品测试"></el-option>
                        <el-option :value=ApplyType.成品组装 label="成品组装"></el-option>
                        <el-option :value=ApplyType.成品联调 label="成品联调"></el-option>
                    </el-select>
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
            <div class="action" v-if="showActions">
                <el-button type="primary" @click="handleCreateSymptom">新增不良现象</el-button>
                <el-button type="success" @click="handleSubmitCompletedForm">表单提交</el-button>
            </div>
            <el-table :data="repairSymptomList">
                <el-table-column type="expand">
                    <template #default="props">
                        <el-table :data="props.row.RepairDeals">
                            <el-table-column label="类别" prop="TypeOfPart" :formatter="typeOfPartFormatter" />
                            <el-table-column label="部件" prop="Part" />
                            <el-table-column label="单元" prop="Unit" />
                            <el-table-column label="处理方法" prop="Treatment" />
                            <el-table-column label="操作" width="350px">
                                <template #default="scope">
                                    <el-button @click="handleEditDeal(scope.row)">编辑</el-button>
                                    <el-button type="danger" @click="handleDeleteDeal(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
                    :width="item.width">
                </el-table-column>
                <el-table-column label="操作" width="250px" v-if="queryForm.applyState == 0 || queryForm.applyState == 2">
                    <template #default="scope">
                        <el-button @click="handleEditSymptom(scope.row)">编辑</el-button>
                        <el-button type="danger" @click="handleDeleteSymptom(scope.row)">作废</el-button>
                        <el-button type="primary" @click="handleCreateDeal(scope.row)">处理</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination" background layout="prev, pager, next" :total="pager.total"
                :page-size="pager.pageSize" @current-change="handleCurrentChange">
            </el-pagination>
        </div>
        <el-dialog title="不良描述项" v-model="showSymptomForm">
            <el-form :rules="symptomRules" :model="repairSymptomForm" label-width="100px" ref="symptomFormRef">
                <el-form-item label="不良类别" prop="RepairTypeId">
                    <el-select placeholder="请输入不良类别" v-model="repairSymptomForm.RepairTypeId">
                        <el-option v-for="item in repairTypeList" :key="item.value" :label=item.label
                            :value=item.value />
                    </el-select>
                </el-form-item>
                <el-form-item label="不良描述" prop="RepairDescription">
                    <el-input :rows="2" type="textarea" placeholder="当前不良类别下对应的不良描述..."
                        v-model="repairSymptomForm.RepairDescription" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleCloseSymptomForm">取消</el-button>
                    <el-button type="primary" @click="handleSubmitSymptomForm">确定</el-button>
                </span>
            </template>
        </el-dialog>
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
                    <el-button @click="handleCloseDealForm">取消</el-button>
                    <el-button type="primary" @click="handleSubmitDealForm">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, reactive, ref, toRaw, nextTick, watch } from 'vue'
// reactive创建引用类型
// ref创建数值类型
// 获取composition API上下文对象
const ctx = getCurrentInstance();
const queryRef = ref(null);
const symptomFormRef = ref(null);
const dealFormRef = ref(null);
//查询对象
const queryForm = reactive({
    productCode: "",
    applyType: "",
    applyState: 0,
});
const ApplyType = {
    SMT: 0,
    THT: 1,
    半成品测试: 2,
    成品组装: 3,
    成品联调: 4
};
const TypeOfPart = {
    板卡: 0,
    结构件: 1,
    组装部件: 2
}
const typeOfPartFormatter = (row, column, value) => {
    // console.log("row:", row, "column:", column,"value:",value)
    return {
        0: "板卡",
        1: "结构件",
        2: "组装部件"
    }[value]
}
const repairSymptomForm = reactive({
    RepairTypeId: '',
    RepairTypeName:'',
    RepairDescription: ''
});
//针对症状表单的操作
const symptomAction = ref("add");

const repairDealForm = reactive({});
//针对处理表单的操作
const dealAction = ref("add");
//不良现象列表（分页显示的数据）
const repairSymptomList = ref([]);
//不良类别列表
const repairTypeList = ref([]);
//"新增不良现象""表单提交"按钮显示
const showActions = ref(true);
//弹框表单显示
const showSymptomForm = ref(false);
const showDealForm = ref(false);
//定义动态表格格式
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
const symptomRules = reactive({
    RepairDescription: [
        {
            required: true,
            message: "请输入不良描述",
            trigger: 'blur'
        }
    ],
});
const dealRules = reactive({
    Treatment: [
        {
            required: true,
            message: "请输入不良处理",
            trigger: 'blur'
        }
    ],
});
const pager = {
    pageIndex: 1,
    pageSize: 10,  //每页10条
    total: 10,  //总页数
}
//重置查询栏
const handleReset = (_, ref) => {
    //element-ui添加prop可以获取表单的对象,显示表单中有哪些对象,校验也依赖prop
    ref.resetFields();
}
const handleQuery = () => {
    getRepairList();
    if (queryForm.productCode != null && queryForm.productCode != "") {
        showActions.value = true;
    } else {
        showActions.value = false;
    }
}
watch(() => queryForm.applyState, () => {
    getRepairList();
})

const getRepairList = async () => {
    let params = { ...queryForm, ...pager };
    let { data } = await ctx.appContext.config.globalProperties.$api.getRepairSymptomList(params);
    repairSymptomList.value = data.Data.res;
    pager.total = data.Data.count;
}

//维修描述项新增确认
const handleCreateSymptom = () => {
    if (queryForm.applyType == null || queryForm.applyType=="") {
        ctx.appContext.config.globalProperties.$message.error("请输入对应维修单类型");
    } else {
        showSymptomForm.value = true;
        symptomAction.value = "add";
        // repairSymptomForm = null;
        getAllRepairType();
    }

};
const symptomId = ref("");
// 维修描述项编辑
const handleEditSymptom = (row) => {
    showSymptomForm.value = true;
    symptomAction.value = "edit";
    console.log("row", row);
    nextTick(() => {
        getAllRepairType();
        repairSymptomForm.RepairTypeId = row.RepairTypeId;
        repairSymptomForm.RepairDescription = row.RepairDescription;
        symptomId.value = row.Id;
    });
    // Object.assign(repairSymptomForm, row);
    console.log("repairSymptomForm", repairSymptomForm)
}

//维修描述项作废
const handleDeleteSymptom = async (row) => {
    console.log("row", row);
    symptomId.value = row.Id;
    let params = { Id: symptomId.value };
    let { data } = await ctx.appContext.config.globalProperties.$api.deleteRepairSymptom(params);
    if (data.Success == true) {
        ctx.appContext.config.globalProperties.$message.success(data.Message);
        getRepairList();
    } else {
        ctx.appContext.config.globalProperties.$message.error(data.Message);
    }
}

//维修描述项新增弹框取消
const handleCloseSymptomForm = () => {
    showSymptomForm.value = false;
    // console.log("symptomFormRef.value",symptomFormRef.value);
    handleReset("", symptomFormRef.value);
}
//获取不良类别列表
const getAllRepairType = async () => {
    let params = { applyType: queryForm.applyType };
    let { data } = await ctx.appContext.config.globalProperties.$api.getAllRepairType(params);
    repairTypeList.value = data.Data;
    // console.log(repairTypeList);
}
//维修描述项新增弹框提交
const handleSubmitSymptomForm = () => {
    console.log("symptomFormRef.value", symptomFormRef.value);
    //表单验证
    symptomFormRef.value.validate(async (valid) => {
        if (valid) {
            repairTypeList.value.forEach((item) => {
                if (repairSymptomForm.RepairTypeId === item.value) {
                    repairSymptomForm.RepairTypeName = item.label;
                }
            });
            let params = toRaw(repairSymptomForm);
            if (symptomAction.value == "add") {
                params.productCode = queryForm.productCode;
                params.applyType = queryForm.applyType;
                let { data } = await ctx.appContext.config.globalProperties.$api.createRepairSymptom(params);
                console.log("params", params);
                console.log(data);
                if (data.Success == true) {
                    showSymptomForm.value = false;
                    // console.log(ctx);
                    ctx.appContext.config.globalProperties.$message.success("创建成功");
                    handleReset("", symptomFormRef.value);
                    getRepairList();
                } else {
                    ctx.appContext.config.globalProperties.$message.error(data.Message);
                }
            } else {
                params.Id = symptomId.value;
                let { data } = await ctx.appContext.config.globalProperties.$api.editRepairSymptom(params);
                console.log("params", params);
                console.log(data);
                if (data.Success == true) {
                    showSymptomForm.value = false;
                    // console.log(ctx);
                    ctx.appContext.config.globalProperties.$message.success("修改成功");
                    handleReset("", symptomFormRef.value);
                    getRepairList();
                } else {
                    ctx.appContext.config.globalProperties.$message.error(data.Message);
                }
            }

        }
    });


}
//维修处理项新增
const handleCreateDeal = (row) => {
    if (queryForm.applyType != ApplyType.SMT && queryForm.applyType != ApplyType.THT) {
        showDealForm.value = true;
        dealAction.value = "add";
        nextTick(() => {
            symptomId.value = row.Id;
        });
    }
    else {
        console.log("SMT,THT部分")
    }

};

// 维修描述项编辑
const handleEditDeal = (row) => {
    showDealForm.value = true;
    dealAction.value = "edit";
    nextTick(() => {
        repairDealForm.TypeOfPart = row.TypeOfPart;
        repairDealForm.Part = row.Part;
        repairDealForm.Unit = row.Unit;
        repairDealForm.Treatment = row.Treatment;
        symptomId.value = row.Id;
    });
}

//维修编辑项删除
const handleDeleteDeal = async (row) => {
    console.log("row", row);
    let params = { Id: row.Id };
    let { data } = await ctx.appContext.config.globalProperties.$api.deleteRepairDeal(params);
    if (data.Success == true) {
        ctx.appContext.config.globalProperties.$message.success(data.Message);
        getRepairList();
    } else {
        ctx.appContext.config.globalProperties.$message.error(data.Message);
    }
}

//维修处理项新增弹框取消
const handleCloseDealForm = () => {
    showDealForm.value = false;
    handleReset("", dealFormRef.value);
}
//维修处理项新增弹框提交
const handleSubmitDealForm = () => {
    dealFormRef.value.validate(async (valid) => {
        if (valid) {
            let params = toRaw(repairDealForm);
            if (dealAction.value == "add") {
                params.Id = symptomId.value;
                let { data } = await ctx.appContext.config.globalProperties.$api.createRepairDeal(params);
                console.log("params", params);
                console.log(data);
                if (data.Success == true) {
                    showDealForm.value = false;
                    // console.log(ctx);
                    ctx.appContext.config.globalProperties.$message.success("创建成功");
                    handleReset("", dealFormRef.value);
                    getRepairList();
                } else {
                    ctx.appContext.config.globalProperties.$message.error(data.Message);
                }
            } else {
                params.Id = symptomId.value;
                let { data } = await ctx.appContext.config.globalProperties.$api.editRepairDeal(params);
                console.log("params", params);
                console.log(data);
                if (data.Success == true) {
                    showDealForm.value = false;
                    // console.log(ctx);
                    ctx.appContext.config.globalProperties.$message.success("修改成功");
                    handleReset("", dealFormRef.value);
                    getRepairList();
                } else {
                    ctx.appContext.config.globalProperties.$message.error(data.Message);
                }
            }
        }
    })
}
//表单提交
const handleSubmitCompletedForm = async () => {
    let params = JSON.stringify(queryForm.productCode);
    let { data } = await ctx.appContext.config.globalProperties.$api.submitCompletedForm(params);
    if (data.Success == true) {
        showDealForm.value = false;
        // console.log(ctx);
        ctx.appContext.config.globalProperties.$message.success("提交成功");
        getRepairList();
    } else {
        ctx.appContext.config.globalProperties.$message.error(data.Message);
    }
};
//分页处理
const handleCurrentChange = (currentPage) => {
    pager.pageIndex = currentPage;
    getRepairList();
}
onMounted(() => {
    getRepairList();

});
</script>

<style lang="scss">
</style>