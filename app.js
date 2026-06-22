App({
  onLaunch() {
    this.globalData = {
      // === OCR 引擎配置 ===
      // mode: 'auto' - 端侧优先+云端兜底（推荐）
      // mode: 'local' - 仅端侧推理（离线可用）
      // mode: 'cloud' - 仅云端 Textin（高精度）
      ocrConfig: {
        mode: 'auto',
        confidenceThreshold: 0.7,  // 低于此值触发云端兜底
        textinAppId: '',           // Textin App ID（cloud 模式必填）
        textinSecretKey: '',       // Textin Secret Key（cloud 模式必填）
        modelLoaded: false,        // 端侧模型是否已下载（自动管理）
        ragApiUrl: '',             // RAG 后端地址（用于 AI 问答）
      },

      userInfo: null,
      contracts: [
        {
          id: 1,
          title: '软件技术服务合同',
          partyA: '北京智合科技有限公司',
          partyB: '上海数联信息技术有限公司',
          amount: '¥128,000.00',
          signDate: '2025-03-15',
          expireDate: '2026-03-14',
          status: 'ready',
          statusText: '已生效',
          type: '技术服务',
          summary: '由乙方为甲方提供企业级SaaS平台开发与运维服务，服务期限一年。'
        },
        {
          id: 2,
          title: '办公设备采购合同',
          partyA: '北京智合科技有限公司',
          partyB: '深圳华创电子商贸有限公司',
          amount: '¥56,800.00',
          signDate: '2025-06-01',
          expireDate: '2025-12-31',
          status: 'review',
          statusText: '审核中',
          type: '采购合同',
          summary: '采购办公电脑、打印机及配套设备共计32台/套。'
        },
        {
          id: 3,
          title: '房屋租赁合同',
          partyA: '北京智合科技有限公司',
          partyB: '北京万达商业物业管理有限公司',
          amount: '¥360,000.00',
          signDate: '2024-07-01',
          expireDate: '2026-06-30',
          status: 'ready',
          statusText: '已生效',
          type: '租赁合同',
          summary: '租赁朝阳区建国路88号写字楼12层整层，面积580平方米，租期两年。'
        },
        {
          id: 4,
          title: '云服务订阅协议',
          partyA: '北京智合科技有限公司',
          partyB: '阿里云计算有限公司',
          amount: '¥24,000.00',
          signDate: '2025-01-10',
          expireDate: '2025-07-09',
          status: 'expired',
          statusText: '已过期',
          type: '服务协议',
          summary: '订阅阿里云企业版ECS、RDS及OSS云服务套餐，期限半年。'
        },
        {
          id: 5,
          title: '产品经销合同',
          partyA: '北京智合科技有限公司',
          partyB: '广州华南电子商贸有限公司',
          amount: '¥850,000.00',
          signDate: '2025-04-01',
          expireDate: '2026-03-31',
          status: 'ready',
          statusText: '已生效',
          type: '销售合同',
          summary: '授权乙方在华南地区经销甲方智能硬件产品，首批订货500台，合同金额85万元。'
        }
      ],
      stats: {
        total: 128,
        expiring: 12,
        pending: 5
      }
    }
  }
})
