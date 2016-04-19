/**
 * Created by rogueleaderr on 6/29/15.
 */


/* change only these */
var youtubeID = "rR6vHY3qYE4";
var postID = "glyph interview";
/* change only these */



// DON'T CHANGE BELOW
$(".video").html("<div id='player'></div>");
var tag = document.createElement('script');
tag.src = "http://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onPlayerStateChange(event) {
    if (event.data ==YT.PlayerState.PLAYING)  {
        mixpanel.track("Video played", {
            "youtubeID": youtubeID,
            "postID": postID

        });
    }
    if (event.data ==YT.PlayerState.ENDED || event.data==0) {
        mixpanel.track("Video ended", {
            "youtubeID": youtubeID,
            "postID": postID
        });
    }
}

var player;
function onYouTubePlayerAPIReady() {
    player = new YT.Player('player',
        {
            videoId: youtubeID,
            events: {'onStateChange': onPlayerStateChange}
        });
}

mixpanel.track("Post viewed", {
    "id": postID
});
