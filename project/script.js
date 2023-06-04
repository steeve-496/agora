let handleError = function(err) {
    console.log("Eroor: ", err);
};

let remoteContainer = document.getElementById("remote-container");

function addVideoStream(elementId) {
    let streamDiv = document.createElement("div");
    streamDiv.id = elementId;
    streamDiv.style.transform = "rotateY(180deg)";
    remoteContainer.appendChild(streamDiv);
};

function remoteVideoStream(elementId) {
    let remoteDiv = document.getElementById(elementId);
    if (remoteDiv) remoteDiv.parentNode.removeChild(remoteDiv);
};


let client = AgoraRTC.createClient({
    mode: "rtc",
    codec: "vp8",
});

client.init("55ce5912c5ed45fdaf3e381db3b969bb", function() {
    console.log("client initialized");
}, function(err) {
    console.log("client init failed", err);
});

client.join(null, "mychannel", null, (uid) => {
    let localStream = AgorRTC.createStream({
        audio: true,
        video: true,
    });
    localStream.init(() => {
        localStream.play("me");
        client.publish(localStream, handleError);
    }, handleError);
}, handleError);

client.on("stream-added", function(evt) {
    client.subscribe(evt.stream, handleError);
});

client.on("stream-subscribed", function(evt) {
    let stream = evt.stream;
    let streamId = String(stream.getId());
    addVideoStream(streamId);
    stream.play(streamId);
});

client.on("stream-removed", function(evt) {
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
});

client.on("peer-leave", function(evt) {
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
});