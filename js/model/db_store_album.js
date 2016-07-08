class StoreAlbum extends Db {

    constructor() {
        super();
        this.dbStore = 'album';
    }

    renderAlbums(){
        var $this = this;
        $this.getAll(function(result){
            if(result.length > 0){
                $('.albums-list .row').empty().append($.templates("#jsrender-album").render(result));
            }
        });
    }
}