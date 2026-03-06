
// Firebase 앱 & Firestore 가져오기
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getFirestore, doc, setDoc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyDPFlzKxrGpElFU0lL-kfXuSuD079HOzYg",
    authDomain: "mult-cbc1c.firebaseapp.com",
    projectId: "mult-cbc1c",
    storageBucket: "mult-cbc1c.firebasestorage.app",
    messagingSenderId: "509437227275",
    appId: "1:509437227275:web:95b41b55c62c919c5bb20e",
    measurementId: "G-1RNEXBMQHJ"
};

// Firebase 초기화
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// 위치 전송 함수
export async function sendLocationToServer(x, y, xx, yy) {
    try {
        const docRef = doc(db, "players", "player1"); // players 컬렉션, player1 문서
        const docRef2 = doc(db, "players", "player2");
        await setDoc(docRef, {
            X: x,
            Y: y,
        });
        await setDoc(docRef2, {
            XX: xx,
            YY: yy,
        });

        console.log("문서 저장 완료!");
    } catch (err) {
        console.error("문서 저장 실패:", err);
    }
};

//위치 업데이트
export async function updateLocation(x, y, xx, yy){
    const docRef = doc(db, "players", "player1");
    const docRef2 = doc(db, "players", "player2");

    if(playerType==0){
        await updateDoc(docRef, {
            X: x,
            Y: y
        });
    } else if(playerType==1) {
        await updateDoc(docRef2, {
            XX: xx,
            YY: yy
        });
    }
};

async function getPlayerLocation(){
    let get=[2];
    let get2=[2];
    if(playerType==1){//player type bluebit
        const docRef = doc(db, "players", "player1");
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        get[0]=data.X;
        get[1]=data.Y;
return(get);
    } else if(playerType==0){//player type redbit
        const docRef2 = doc(db, "players", "player2");
        const docSnap = await getDoc(docRef2);
        const data = docSnap.data();
        get2[0]=data.XX;
        get2[1]=data.YY;
return(get2);
    }
};

//mpx.cmd live-server

const drawingBoard = document.getElementById('canvas');
const ctx = drawingBoard.getContext('2d');
const playerTypeChange = document.getElementById('player');
const gameStart = document.getElementById('start');
const restrat = document.getElementById('restart');

let playerType=0;

let x = 10;
let y = 10;
let xx = 30;
let yy = 30;

let shootingX=x;
let shootingY=y;
let shootingXX=xx;
let shootingYY=yy;

let shootingMovement=10;
let shootingMovement2=10;

let playerAim=0;
let playerAim2=0;/*
null=0
Arrow up=1
Arrow down=2
Arrow left=3
Arrow down=4
*/

const moveAmount = 5;

function moveRight() { x += moveAmount; }
function moveLeft() { x -= moveAmount; }
function moveDown() { y += moveAmount; }
function moveUp() { y -= moveAmount; }

function moveRight2() { xx += moveAmount; }
function moveLeft2() { xx -= moveAmount; }
function moveDown2() { yy += moveAmount; }
function moveUp2() { yy -= moveAmount; }

function draw() {
    ctx.clearRect(0, 0, drawingBoard.width, drawingBoard.height);

    // 파란 사각형
    ctx.fillStyle = 'blue';
    ctx.fillRect(x, y, 10, 10);

    // 빨간 사각형
    ctx.fillStyle = 'red';
    ctx.fillRect(xx, yy, 10, 10);

    if(playerType==0) {
        if (keys.ArrowLeft) moveLeft();
        if (keys.ArrowRight) moveRight();
        if (keys.ArrowDown) moveDown();
        if (keys.ArrowUp) moveUp();
    } else {
        if (keys.ArrowLeft) moveLeft2();
        if (keys.ArrowRight) moveRight2();
        if (keys.ArrowDown) moveDown2();
        if (keys.ArrowUp) moveUp2();
    }
}

setInterval(draw, 16);

const keys = {
    ArrowLeft : false,
    ArrowRight : false,
    ArrowUp : false,
    ArrowDown : false
};

document.addEventListener('keydown', async (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
    shootingX=x;
    shootingY=y;
    shootingXX=xx;
    shootingYY=yy;
});

playerTypeChange.addEventListener('click', () => {
    if(playerType==0){
        playerType=1
    } else if(playerType=1){
        playerType=0
    }
    
    console.log(playerType);
});

gameStart.addEventListener('click', () => {
    sendLocationToServer(x,y,xx,yy);
});

async function liveLocateUpdate(){
    await updateLocation(x,y,xx,yy);
    if(playerType==1){//player type redbit
        const tempLocation = await getPlayerLocation();
        x=tempLocation[0];
        y=tempLocation[1];
    } else if(playerType==0){//player type bluebit
        const tempLocation = await getPlayerLocation();
        xx=tempLocation[0];
        yy=tempLocation[1];
    }
}

setInterval(liveLocateUpdate,16);

restrat.addEventListener('click', async()=>{
    const docRef = doc(db, "players", "player1");
    const docRef2 = doc(db, "players", "player2");
    await updateDoc(docRef, {
        X: 10,
        Y: 10
    });
    await updateDoc(docRef2, {
        XX: 30,
        YY: 30
    });
});

function shootingPlayer1() {
    if(playerAim==1) {
        drawShooting();
        shootingY=shootingY-shootingMovement;
    } else if(playerAim==2) {
        drawShooting();
        shootingY=shootingY+shootingMovement;
    } else if(playerAim==3) {
        drawShooting();
        shootingX=shootingX-shootingMovement;
    } else if(playerAim==4) {
        drawShooting();
        shootingX=shootingX+shootingMovement;
    }
}
function shootingPlayer2() {
    if(playerAim2==1) {
        drawShooting();
        shootingYY=shootingYY-shootingMovement2;
    } else if(playerAim2==2) {
        drawShooting();
        shootingYY=shootingYY+shootingMovement2;
    } else if(playerAim2==3) {
        drawShooting();
        shootingXX=shootingXX-shootingMovement2;
    } else if(playerAim2==4) {
        drawShooting();
        shootingXX=shootingXX+shootingMovement2;
    }
}
function drawShooting() {
    if(playerType==0){
        ctx.fillStyle = 'white';
        ctx.fillRect(shootingX, shootingY, 10, 10);
    }else if(playerType==1){
        ctx.fillStyle = 'white';
        ctx.fillRect(shootingXX, shootingYY, 10, 10);
    }
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        if(playerType==0){playerAim=1}
        if(playerType==1){playerAim2=1}
    }
    if (e.key === 'ArrowDown') {
        if(playerType==0){playerAim=2}
        if(playerType==1){playerAim2=2}
    }
    if (e.key === 'ArrowLeft') {
        if(playerType==0){playerAim=3}
        if(playerType==1){playerAim2=3}
    }
    if (e.key === 'ArrowRight') {
        if(playerType==0){playerAim=4}
        if(playerType==1){playerAim2=4}
    }
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'w') {
        if(playerType==0){
            shootingPlayer1();
        }else if (playerType==1){
            shootingPlayer2();
        }
    }
});