<template>
  <div>
    <div class="main-box recharge">
      <el-row :gutter="20">
        <el-col :span="4" :offset="20">
          <el-button class="btn" type="primary" round @click="dialogVisible = true">立即充值</el-button>
        </el-col>
      </el-row>
      <el-dialog title="充值提醒" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <span>请联系****</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <el-row class="overview" :gutter="5">
      <el-col :span="8">
        <div class="main-box">
          <div><h2>100<span>条</span></h2><p>剩余线索</p></div>
          <div><h2>8499<span>条</span></h2><p>已领取线索</p></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="main-box">
          <div><h2>430<span>时</span>23<span>分</span>32<span>秒</span></h2><p>剩余通话时长</p></div>
          <div><h2>320<span>时</span>23<span>分</span>32<span>秒</span></h2><p>已通话时常</p></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="main-box">
          <div><h2>8499<span>条</span></h2><p>剩余短信</p></div>
          <div><h2>8499<span>条</span></h2><p>已发短信</p></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getLocalStorage, parseToTimestamp, beforeToday, beforeAweek} from "@/utils/index";
export default {
  data() {
    return {
      dialogVisible: false
    }
  },
  watch: {},
  created() {},
  methods: {
    
  }
};
</script>
<style lang="scss" scoped>
.recharge {
  padding: 46px 160px;
  background-image: url("~@/assets/images/rechargebg.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 101% 105%;
  box-shadow: none;
  .btn {
    width: 240px;
    height: 56px;
    background: linear-gradient(
      -23deg,
      rgba(64, 136, 255, 1),
      rgba(64, 109, 255, 1)
    );
    box-shadow: 0px 2px 4px 0px rgba(43, 97, 187, 0.5);
    border-radius: 28px;
    font-size: 24px;
  }
}
.overview {
  .el-col {
    padding: 0 70px;
    margin-top: 16px;
    div {
      div {
        text-align: center;
        padding: 104px 0;
        &:first-child {
          border-bottom: 1px solid #d1d1d3;
        }
        h2 {
          font-size: 72px;
          margin-block-end: 0;
          margin-block-start: 0;
          span {
            font-size: 16px;
            margin-left: 10px;
          }
        }
        p {
          font-size: 18px;
          color: #666;
        }
      }
    }
    &:first-child {
      h2 {
        color: #4088ff;
      }
    }
    &:nth-child(2) {
      h2 {
        color: #7a40ff;
      }
    }
    &:last-child {
      h2 {
        color: #cb40ff;
      }
    }
  }
}
</style>