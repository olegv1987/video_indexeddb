class StoreFile extends Db {

    constructor() {
        super();
        this.dbStore = 'file';
    }

    renderFiles(albumId){
        var $this = this;
        $this.getByCondition('album_id', albumId, function(result){
            $('.files-list .row').empty();
            if(result.length > 0){
                for(var i = 0; i < result.length; i++){
                    var data = {
                        id: result[i].id,
                        album_id: result[i].album_id,
                        file: window.URL.createObjectURL(result[i].file)
                    };
                    $('.files-list .row').append($.templates("#jsrender-file").render(data));
                }
            }
        });
    }
}