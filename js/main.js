jQuery(function($){

    var storeAlbum = new StoreAlbum(),
        storeFile = new StoreFile();

    $("body").on("albumLoad", function (event) {

        var video = new Video();

        video.startStream();

        $('#record').click(function(){
            video.toggleRecording();
        });
        $('#play').click(function(){
            video.play();
        });
        $('#download').click(function(){
            video.download();
        });



        var val = app.page("album", function () {



            // present the view - load data and show:
            return function (param) {
                var albumId = parseInt(param);

                storeFile.renderFiles(albumId);

                $('body').on('click', '.delete-file-item', function(e) {
                    var id = $(this).parents('.file-item').data('id');

                    storeFile.deleteItem(parseInt(id), function(result){
                        storeFile.renderFiles(albumId);
                    });
                });


                $('#save').click(function(){
                    video.save(storeFile, albumId);
                });

            }
        });

    });

    app.page("albums", function () {

        storeAlbum.renderAlbums();

    });

    // Handle add new album
    $('body').on('submit', '#album-form', function(e) {

        var $form = $(this);
        e.preventDefault();
        $('#album-modal').modal('hide');

        var name = $form.find('#name').val();
        var thumb = $form.find('#thumb').get(0).files[0];
        var id = $form.find('#album-id').val();
        var reader = new FileReader();
        if (thumb) {
            reader.readAsDataURL(thumb);
        }

        reader.onloadend = function () {
            var album = {
                name: name,
                thumb: reader.result
            };
            if(id){
                album.id = parseInt(id);
            }
            storeAlbum.saveItem(album, function(result){
                storeAlbum.renderAlbums();
            });
            $form[0].reset();
            $form.find('#album-id').val('');
        }

    });

    // Handle edit album
    $('body').on('click', '.edit-album-item', function(e) {
        var $item = $(this).parents('.album-item');

        $('#album-modal #album-id').val($item.data('id'));
        $('#album-modal #name').val($item.find('.album-item-title').text());

        $('#album-modal').modal('show');
    });

    // Handle delete album
    $('body').on('click', '.delete-album-item', function(e) {
        var id = $(this).parents('.album-item').data('id');

        storeAlbum.deleteItem(parseInt(id), function(result){
            storeAlbum.renderAlbums();
        });
    });



});