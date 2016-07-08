class Video {

    constructor() {
        this.recordedBlobs;
        this.videoWebcam = $('#video-webcam');
        this.videoRecord = $('#video-record');
        this.recordButton = $('#record');
        this.playButton = $('#play');
        this.downloadButton = $('#download');
        this.saveButton = $('#save');
    }

    // start stream in real time
    startStream() {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

        if (navigator.getUserMedia) {
            navigator.getUserMedia({
                video: true
                //audio: true   // uncomment for rocording with audio
            }, this.handleSuccess, function(e){
                console.log(e);
            });
        }
    }

    handleSuccess(stream) {
        var $this = this;
        console.log('getUserMedia() got stream: ', stream);
        window.stream = stream;
        if (window.URL) {
            $('#video-webcam').get(0).src = window.URL.createObjectURL(stream);
        } else {
            $('#video-webcam').get(0).src = stream;
        }
    }

    toggleRecording() {
        if (this.recordButton.data('status') == 'ready') {
            this.startRecording();
        } else {
            this.stopRecording();
            this.recordButton.data('status', 'ready');
            this.recordButton.text('Record');
            this.playButton.prop('disabled', false);
            this.downloadButton.prop('disabled', false);
            this.saveButton.prop('disabled', false);
        }
    }

    startRecording() {
        var $this = this;
        this.recordedBlobs = [];
        var options = {mimeType: 'video/webm;codecs=vp9'};
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.log(options.mimeType + ' is not Supported');
            options = {mimeType: 'video/webm;codecs=vp8'};
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                console.log(options.mimeType + ' is not Supported');
                options = {mimeType: 'video/webm'};
                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                    console.log(options.mimeType + ' is not Supported');
                    options = {mimeType: ''};
                }
            }
        }
        try {
            this.mediaRecorder = new MediaRecorder(window.stream, options);
        } catch (e) {
            console.error('Exception while creating MediaRecorder: ' + e);
            alert('Exception while creating MediaRecorder: '
                + e + '. mimeType: ' + options.mimeType);
            return;
        }
        console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);
        this.recordButton.data('status', 'recording');
        this.recordButton.text('Stop');
        this.playButton.prop('disabled', true);
        this.downloadButton.prop('disabled', true);
        this.saveButton.prop('disabled', true);
        this.mediaRecorder.onstop = function(e){
            console.log('Recorder stopped: ', e);
        };
        this.mediaRecorder.ondataavailable = function (e) {
            if (e.data && e.data.size > 0) {
                $this.recordedBlobs.push(e.data);
            }
        };
        this.mediaRecorder.start(10); // collect 10ms of data
        console.log('MediaRecorder started', this.mediaRecorder);
    }

    stopRecording() {
        this.mediaRecorder.stop();
        console.log('Recorded Blobs: ', this.recordedBlobs);
        this.videoRecord.prop('controls', true);
    }

    play() {
        var superBuffer = new Blob(this.recordedBlobs, {type: 'video/webm'});
        this.videoRecord.get(0).src = window.URL.createObjectURL(superBuffer);
    }

    download() {
        var blob = new Blob(this.recordedBlobs, {type: 'video/webm'});
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'video.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }

    save(storeFile, albumId) {
        var type = 'video/webm',
            blob = new Blob(this.recordedBlobs, {type: type});
        storeFile.saveItem({
            album_id: albumId,
            file_type: 'video/webm',
            file: blob
        }, function (result) {
            var test = 1;
            storeFile.renderFiles(albumId);
        });
    }


}