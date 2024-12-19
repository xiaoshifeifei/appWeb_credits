<template>
  <div class="signature-pad">
    <canvas ref="canvas" class="canvas"></canvas>
    <div class="button">
      <el-button style="margin-left: 10px" type="primary" @click="save">
        {{ t("general.preservation") }}
      </el-button>
      <el-button @click="clear">
        {{ t("general.eliminate") }}
      </el-button>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n"; // added by mohamed hassan to support multilanguage
const { t } = useI18n(); // added by mohamed hassan to support multilanguage

const canvas = ref(null);
const context = ref(null);

onMounted(() => {
  const canvasElement = canvas.value;
  canvasElement.width = canvasElement.clientWidth;
  canvasElement.height = canvasElement.clientHeight;
  context.value = canvasElement.getContext("2d");
  context.value.strokeStyle = "#000000";
  context.value.lineWidth = 2;
  context.value.lineCap = "round";

  canvasElement.addEventListener("mousedown", startDrawing);
  canvasElement.addEventListener("mouseup", stopDrawing);
  canvasElement.addEventListener("mousemove", draw);
});
const getTableData = () => {
  const canvasElement = canvas.value;
  canvasElement.width = canvasElement.clientWidth;
  canvasElement.height = canvasElement.clientHeight;
  context.value = canvasElement.getContext("2d");
  context.value.strokeStyle = "#000000";
  context.value.lineWidth = 2;
  context.value.lineCap = "round";

  canvasElement.addEventListener("mousedown", startDrawing);
  canvasElement.addEventListener("mouseup", stopDrawing);
  canvasElement.addEventListener("mousemove", draw);
};
setTimeout(() => {
  getTableData();
}, 1000);
let isDrawing = false;

function startDrawing(event) {
  isDrawing = true;
  draw(event);
}

function stopDrawing() {
  isDrawing = false;
  context.value.beginPath();
}

function draw(event) {
  if (!isDrawing) return;
  const rect = canvas.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  context.value.lineTo(x, y);
  context.value.stroke();
}

function clear() {
  context.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
}

function save() {
  const dataURL = canvas.value.toDataURL("image/png");
  console.log("签名保存为:", dataURL);
  // 你可以将 dataURL 发送到服务器或进行其他处理
}
</script>
  
  <style scoped>
.signature-pad {
  position: relative;
  border: 1px solid #ddd;
  width: 50%;
  height: 200px;
  background: #f9f9f9;
}

.canvas {
  width: 100%;
  height: 100%;
}

button {
  float: right;
}
</style>
  