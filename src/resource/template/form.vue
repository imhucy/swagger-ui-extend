<template>
	<div class="info">
		<div class="info-left">
			<div class="block">
				<el-image class="img" :src="organizationVO.img"></el-image>
			</div>
			<p>机构编号：{{ organizationVO.orgCode }}</p>
			<p>机构名称：{{ organizationVO.orgName }}</p>
		</div>
		<div class="info-right">
			<form-create :rule="rule" v-model="fApi" :option="options" />
			<div class="form-btn" v-if="type == 'edit' || type == 'insert'">
				<el-button type="primary" plain @click="submit">保存</el-button>
				<el-button aligen="center" plain @click="reset">重置</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import { mapRequest } from 'rd-http';
export default {
	name: 'Info',
	props: {
		formData: Object,
		type: {
			type: String,
			default: 'view'
		}
	},
	data() {
		return {
			organizationVO: {},
			fApi: {},
			orgId: '',
			options: {
				submitBtn: false //
			},
			rule: [
				{
					type: 'hidden',
					field: 'orgId',
					title: '机构id',
					validate: [{ type: 'string', required: true, message: '请输入机构id' }],
					props: {
						disabled: true
					}
				},
				{
					type: 'hidden',
					field: 'oeiId',
					title: '填报id',
					validate: [{ required: true, message: '请输入填报id' }],
					props: {
						disabled: true
					}
				},
				{
					type: 'input',
					field: 'computers',
					title: '电脑数量',
					validate: [{ required: true, message: '请输入数量' }],
					props: {
						disabled: true
					}
				},
				{
					type: 'input',
					field: 'cameras',
					title: '摄像头数量',
					validate: [{ required: true, message: '请输入数量' }],
					props: {
						disabled: true
					}
				},
				{
					type: 'radio',
					title: '网络',
					field: 'network',
					value: 0,
					options: [
						{ value: 1, label: '有' },
						{ value: 0, label: '无' }
					],
					props: {
						disabled: true
					}
				},
				{
					type: 'radio',
					title: '工作站',
					field: 'doctorWorkstation',
					value: 0,
					options: [
						{ value: 1, label: '有' },
						{ value: 0, label: '无' }
					],
					props: {
						disabled: true
					}
				},
				{
					type: 'radio',
					title: '医院信息管理系统',
					field: 'his',
					value: 0,
					options: [
						{ value: 1, label: '有' },
						{ value: 0, label: '无' }
					],
					props: {
						disabled: true
					}
				},
				{
					type: 'radio',
					title: '中国特色业务信息系统',
					field: 'tcmSystem',
					value: 0,
					options: [
						{ value: 1, label: '有' },
						{ value: 0, label: '无' }
					],
					props: {
						disabled: true
					}
				}
			]
		};
	},
	mounted() {
		if (this.type == 'edit') {
			this.getInfo();
			this.updataForm();
		} else if (this.type == 'insert') {
			this.insertForm();
			this.setInsertFromValue(this.formData);
		} else if (this.type == 'view') {
			this.getInfo();
		}
	},
	methods: {
		getInfo() {
			this.orgExpandGetSingleInfo(
				this.$qs.stringify({
					orgId: this.formData.orgId,
					oeiId: this.formData.oeiId
				})
			).then(res => {
				this.organizationVO = res.data.organizationVO;
				console.log(this.organizationVO.img);
				this.setFormVlue(res.data.orgExpandVO);
			});
		},
		updataForm() {
			this.rule = [
				{
					type: 'hidden',
					field: 'orgId',
					title: '机构id',
					validate: [{ type: 'string', required: true, message: '请输入机构id' }],
					props: {
						disabled: true
					}
				},
				{
					type: 'hidden',
					field: 'oeiId',
					title: '填报id',
					validate: [{ required: true, message: '请输入填报id' }],
					props: {
						disabled: true
					}
				},
				{
					type: 'input',
					field: 'computers',
					title: '电脑数量',
					validate: [{ required: true, message: '请输入数量' }],
					props: {
						disabled: false
					}
				},
				{
					type: 'input',
					field: 'cameras',
					title: '摄像头数量',
					validate: [{ required: true, message: '请输入数量' }],
					props: {
						disabled: false
					}
				},
				{
					type: 'radio',
					title: '网络',
					field: 'network',
					value: 0,
					options: [
						{ value: 1, label: '有' },
						{ value: 0, label: '无' }
					],
					props: {
						disabled: false
					}
				},
				{
					type: 'radio',
					title: '工作站',
					field: 'doctorWorkstation',
					value: 0,
					options: [
						{ value: 1, label: '有' },
						{ value: 0, label: '无' }
					],
					props: {
						disabled: false
					}
				},
				{
					type: 'radio',
					title: '医院信息管理系统',
					field: 'his',
					value: 0,
					options: [
						{ value: 1, label: '有' },
						{ value: 0, label: '无' }
					],
					props: {
						disabled: false
					}
				},
				{
					type: 'radio',
					title: '中国特色业务信息系统',
					field: 'tcmSystem',
					value: 0,
					options: [
						{ value: 1, label: '有' },
						{ value: 0, label: '无' }
					],
					props: {
						disabled: false
					}
				}
			];
		},
		insertForm() {
			this.rule = [
				{
					type: 'input',
					field: 'computers',
					title: '电脑数量',
					validate: [{ required: true, message: '请输入数量' }],
					props: {
						disabled: false
					}
				},
				{
					type: 'input',
					field: 'cameras',
					title: '摄像头数量',
					validate: [{ required: true, message: '请输入数量' }],
					props: {
						disabled: false
					}
				},
				{
					type: 'radio',
					title: '网络',
					field: 'network',
					value: 0,
					options: [
						{ value: 1, label: '有' },
						{ value: 0, label: '无' }
					],
					props: {
						disabled: false
					}
				},
				{
					type: 'radio',
					title: '工作站',
					field: 'doctorWorkstation',
					value: 0,
					options: [
						{ value: 1, label: '有' },
						{ value: 0, label: '无' }
					],
					props: {
						disabled: false
					}
				},
				{
					type: 'radio',
					title: '医院信息管理系统',
					field: 'his',
					value: 0,
					options: [
						{ value: 1, label: '有' },
						{ value: 0, label: '无' }
					],
					props: {
						disabled: false
					}
				},
				{
					type: 'radio',
					title: '中国特色业务信息系统',
					field: 'tcmSystem',
					value: 0,
					options: [
						{ value: 1, label: '有' },
						{ value: 0, label: '无' }
					],
					props: {
						disabled: false
					}
				}
			];
		},
		setFormVlue(data) {
			this.fApi.setValue({
				oeiId: data.oeiId,
				orgId: data.orgId,
				computers: data.computers,
				cameras: data.cameras,
				network: data.network,
				his: data.his,
				doctorWorkstation: data.doctorWorkstation,
				tcmSystem: data.tcmSystem
			});
		},
		setInsertFromValue(data) {
			this.orgId = data.orgId;
		},
		submit() {
			this.fApi.submit((formData, $f) => {
				console.log($f, formData, JSON.stringify(formData), 'fapi');
				if (this.type == 'edit') {
					this.orgExpandEdit(this.$qs.stringify(formData)).then(res => {
						this.$message({
							message: res.msg,
							type: 'success'
						});
						this.$emit('confirm', '编辑成功');
					});
				} else if (this.type == 'insert') {
					formData.orgId = this.orgId;
					console.log(formData);
					this.orgExpandAdd(this.$qs.stringify(formData)).then(res => {
						this.$message({
							message: res.msg,
							type: 'success'
						});
						this.$emit('confirm', '新增成功');
					});
				}
			});
		},
		reset() {
			this.fApi.resetFields();
		},
		...mapRequest(['orgExpandGetSingleInfo', 'orgExpandEdit', 'orgExpandAdd'])
	}
};
</script>

<style lang="scss" scoped>
.info {
	display: flex;
	.info-left {
		width: 300px;
		.img {
			width: 100%;
			height: 240px;
		}
	}
	.info-right {
		flex: 1;
		padding-left: 20px;
		.form-btn {
			margin: 20px;
			text-align: center;
		}
	}
}
</style>
