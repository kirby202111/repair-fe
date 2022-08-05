<template>
    <div class="user-manage">
        <div class="alert">
            <el-alert :title=repairHistory type="warning" show-icon />
        </div>
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
            <div class="action">
                <el-button type="primary" @click="handleCreateSymptom" v-if="showCreateSymptom">新增不良现象</el-button>
                <el-button type="success">表单提交</el-button>
            </div>
            <el-table :data="repairSymptomList">
                <el-table-column type="expand">
                    <template #default="props">
                        <el-table :data="props.row">
                            <el-table-column label="产品" prop="product" />
                            <el-table-column label="部件" prop="component" />
                            <el-table-column label="处理方法" prop="treatment" />
                            <el-table-column label="操作" width="200px">
                                <template #default="scope">
                                    <el-button @click="dealEdit(scope.$index, scope.row)" size="small">编辑</el-button>
                                    <el-button type="danger" size="small">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
                    :width="item.width">
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template #default="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)" size="small">编辑</el-button>
                        <el-button type="danger" size="small">删除</el-button>
                        <el-button type="primary" @click="handleCreateDeal">处理</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination" background layout="prev, pager, next" :total="pager.total"
                :page-size="pager.pageSize" @current-change="handleCurrentChange">
            </el-pagination>
        </div>
        <el-dialog title="不良描述项新增" v-model="showSymptomForm">
            <el-form :model="repairSymptomForm" :rules="symptomRules" v-model="repairSymptomForm">
                <el-form-item label="不良类别" v-model="repairTypeList">
                    <el-select placeholder="请输入不良类别">
                        <el-option :label=repairTypeList.label :value=repairTypeList.value />
                        <el-option :label=repairTypeList.label :value=repairTypeList.value />
                    </el-select>
                </el-form-item>
                <el-form-item label="不良描述">
                    <el-input :rows="2" type="textarea" placeholder="当前不良类别下对应的不良描述..." />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button>取消</el-button>
                    <el-button type="primary">确定</el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog title="不良处理项新增" v-model="showDealForm">
            <el-form :model="repairDealForm" label-width="100px">
                <el-form-item label="产品类别">
                    <el-select placeholder="请输入产品类别">
                        <el-option label="外购件" value="不良类别1" />
                        <el-option label="自制件" value="不良类别2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="维修产品名">
                    <el-input title="维修产品名"></el-input>
                </el-form-item>
                <el-form-item label="维修部件">
                    <el-input title="维修部件"></el-input>
                </el-form-item>
                <el-form-item label="不良处理">
                    <el-input :rows="2" type="textarea" placeholder="当前不良类别下对应的不良处理..." />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button>取消</el-button>
                    <el-button type="primary">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref } from 'vue'
export default {
    name: 'repairHandle',
    // setup是compositionAPI入口函数
    setup() {
        // reactive创建引用类型
        // ref创建数值类型
        // 获取composition API上下文对象
        const ctx = getCurrentInstance();
        const queryRef = ref(null);
        //查询对象
        const queryForm = reactive({
            productCode: "",
            applyType: null,
            applyState: 0,
        });
        const ApplyType = {
            SMT: 0,
            THT: 1,
            半成品测试: 2,
            成品组装: 3,
            成品联调: 4
        }
        const repairHistory = ref("维修历史文本");
        const repairSymptomForm = reactive([]);
        const repairDealForm = reactive([]);
        const repairSymptomList = ref([
            {
                repairId: "",
                productCode: "",
                productId: "",
                MeterialId: "",
                applyType: ApplyType.成品组装,
                userName: "小明",
                defectiveClass: "显示",
                defectiveDescribe: "屏幕闪屏",
                createTime: "2022-7-14",
                lastLoginTime: "2022-7-14",
            }
        ]);
        const repairTypeList = ref([]);
        //"新增不良现象"按钮显示
        const showCreateSymptom = ref(true);
        //弹框表单显示
        const showSymptomForm = ref(false);
        const showDealForm = ref(false);
        //定义动态表格格式
        const columns = reactive([
            {
                label: "返修单号",
                prop: "RepairId"
            },
            {
                label: "申请人",
                prop: "userName"
            },
            {
                label: "不良类别",
                prop: "defectiveClass"
            },
            {
                label: "不良描述",
                prop: "defectiveDescribe"
            },
            {
                label: "申请时间",
                prop: "createTime"
            },
            {
                label: "审批人",
                prop: "auditUser"
            },
            {
                label: "当前审批人",
                prop: "curAuditUser"
            },
            {
                label: "审批状态",
                prop: "applyState"
            },
        ]);
        const symptomRules = reactive({
            pass: [
                {
                    trigger: 'blur'
                }
            ],
            checkPass: [
                {
                    trigger: 'blur'
                }
            ],
            age: [
                {
                    trigger: 'blur'
                }
            ],
        });
        const pager = {
            pageIndex: 1,
            pageSize: 10,  //每页10条
            total: 0,  //总页数
        }
        //重置查询栏
        const handleReset = (_, ref) => {
            //element-ui添加prop可以获取表单的对象,显示表单中有哪些对象,校验也依赖prop
            ref.resetFields();
        }
        const handleQuery = () => {
            getRepairList();
        }
        const getRepairList = async () => {
            let list = await ctx.appContext.config.globalProperties.$api.getRepairSymptomList(queryForm, pager);
            repairSymptomList.value = list;

        }
        //维修描述项新增
        const handleCreateSymptom = () => {
            showSymptomForm.value = true;
        };
        //维修处理项新增
        const handleCreateDeal = () => {
            showDealForm.value = true;
        };
        //分页处理
        const handleCurrentChange = (currentPage) => {
            pager.pageIndex = currentPage;
            getRepairList();
        }
        onMounted(() => {
            getRepairList();

        });
        return {
            queryRef,
            queryForm,
            ApplyType,
            repairHistory,
            repairSymptomForm,
            repairDealForm,
            repairSymptomList,
            repairTypeList,
            showCreateSymptom,
            showSymptomForm,
            showDealForm,
            columns,
            symptomRules,
            pager,
            handleReset,
            handleQuery,
            getRepairList,
            handleCreateSymptom,
            handleCreateDeal,
            handleCurrentChange
        }
    }
}
</script>

<style lang="scss">
</style>