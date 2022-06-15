<template></template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { ResultEnum } from "@/enums/httpEnum";
import recharge from "./Recharge.vue";
import {
  LockOutlined,
  LoadingOutlined,
  UserOutlined,
  ApiOutlined,
  ArrowRightOutlined,
  WifiOutlined,
} from "@vicons/antd";
import { useRouter, useRoute } from "vue-router";
import { useTime } from "@/hooks/useTime";
import { useOnline } from "@/hooks/useOnline";
import { useBattery } from "@/hooks/useBattery";

export default defineComponent({
  name: "LockScreen",
  components: {
    LockOutlined,
    LoadingOutlined,
    UserOutlined,
    ArrowRightOutlined,
    ApiOutlined,
    WifiOutlined,
    recharge,
  },
  setup() {
    const state = reactive({
      showLogin: false,
      loginLoading: false, // 正在登录
      isLoginError: false, //密码错误
      errorMsg: "密码错误",
      loginParams: {
        username: "",
        password: "",
      },
    });
    const { month, day, hour, minute, second, week } = useTime();
    const { battery, batteryStatus, calcDischargingTime, calcChargingTime } =
      useBattery();
    const { online } = useOnline();
  },
});
</script>
<style lang="less" scoped>
.lockscreen {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  background: #000;
  color: white;
  overflow: hidden;
  z-index: 9999;

  &.onLockLogin {
    background-color: rgba(25, 28, 34, 0.88);
    backdrop-filter: blur(7px);
  }

  .login-box {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    > * {
      margin-bottom: 14px;
    }

    .username {
      font-size: 30px;
    }
  }

  .lock-box {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 34px;
    z-index: 100;

    .tips {
      color: white;
      cursor: text;
    }

    .lock {
      display: flex;
      justify-content: center;

      .lock-icon {
        cursor: pointer;

        .anticon-unlock {
          display: none;
        }

        &:hover .anticon-unlock {
          display: initial;
        }

        &:hover .anticon-lock {
          display: none;
        }
      }
    }
  }

  .local-time {
    position: absolute;
    bottom: 60px;
    left: 60px;
    font-family: helvetica;

    .time {
      font-size: 70px;
    }

    .date {
      font-size: 40px;
    }
  }

  .computer-status {
    position: absolute;
    bottom: 60px;
    right: 60px;
    font-size: 24px;

    > * {
      margin-left: 14px;
    }

    .network {
      position: relative;

      &.offline::before {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: 2px;
        height: 28px;
        transform: translate(-50%, -50%) rotate(45deg);
        background-color: red;
        z-index: 10;
      }
    }
  }
}
</style>
