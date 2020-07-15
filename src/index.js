import "./styles.css";
import "regenerator-runtime/runtime";

const RecodingButton = document.querySelector("button");
const recodingTime = document.querySelector(".recodingTime");

let time = 0;
let fullBlob = new Blob([], { mimeType: "audio/webm;codecs=opus" });

function onRecodingClick(e) {
  // stream을 만들어냅니다.
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      // mediaRecoder로 녹음을 시작합니다.
      var mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      // 녹화 시작. 1초마다 chunk를 생성
      mediaRecorder.start(1000);

      // start에 설정한 timeslice에 따라 1초 마다 dataavailable한 blob 추출됨
      mediaRecorder.addEventListener("dataavailable", (e) => {
        time++;
        recodingTime.innerHTML = `Recoding for ${time}`;
        console.log(e.data);
      });

      // 버튼의 글을 바꿉니다.
      RecodingButton.innerHTML = "Stop Recoding";
    })
    .catch((err) => console.log(err));
}

RecodingButton.addEventListener("click", onRecodingClick);
