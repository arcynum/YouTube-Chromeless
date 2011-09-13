(function( $ ){
  $.fn.ytchromeless = function(options) {
  
    //Initial configuration
    var config = {
			playing			:  false,
      videoWidth  : '640',
      videoHeight : '360',
      videoIdBase : 'ytplayer',
      params : { 
		    allowScriptAccess: 'always',
		    wmode: 'transparent'
		  }
    };
		
		return this.each(function(i) {
		
			// initial var setup
			var o    = $.extend(config, options),
			
			// set jQuery objects
			$link      = $(this),

			// set variables          
			url        = $link.attr('href'),
			videoId    = $link.attr('id') || o.videoIdBase + i,
			ytVideoId  = url.substr(31),

			// new DOM elements
			$video     = $link.wrap( '<div class="video-player"></div>' ).parent(),
			$toReplace = $('<div class="video"></div>').prependTo( $video ).attr('id', videoId),
			$loaded,
			$play,

			// set up the special player object
			player;
				
			// bind public methods upfront 
			$video.bind({

				// playing, pausing, muting, 
				'togglePlay'  : function(){ $video.togglePlay(); },
				'play'        : function(){ $video.play(); },
				'pause'       : function(){ $video.pause(); },
				'max'   		  : function(){ $video.max(); },

				// initializing and revising the player
				'update'      : function(){ $video.update(); },
				'cue'         : function(){ player.cueVideoById( ytVideoId ); }

			});
			
			// control methods
			// function fired when the play/pause button is hit
			$video.togglePlay = function() {
				if( o.playing ) {
					$video.trigger('pause');
				} else {
					$video.trigger('play');
				}
				return false;
			};
		
			// play the video
			$video.play = function() {
				player.playVideo();
				o.playing = true;
			};  
		
			// pause
			$video.pause = function() {
				player.pauseVideo();
				o.playing = false;
			};
			
			// Set volume to max
			$video.max = function() {
				player.setVolume(100);
			};
			
			//Update the video status
			$video.update = function() {
				if( player && player.getDuration ) {
					if( player.getPlayerState() === 1 ) {
						$video.play();
					}
					else if ( player.getPlayerState() === 0 ) {
						$video.pause();
					}
				}

			};
			
			// the youtube movie calls this method when it loads
			// DO NOT CHANGE THIS METHOD'S NAME
			onYouTubePlayerReady = function( videoId ) {
				// Video Itself
				var $videoRef = $( document.getElementById( videoId ) ).parent();

				setInterval(function(){
					$videoRef.trigger('update');
				}, 250);
				
				$videoRef.trigger('cue');
				$videoRef.trigger('max');
				$videoRef.click(function() {
					$videoRef.trigger('togglePlay');
				});
				
			};
			
			// the embed!
			$video.init = function() {
			
				swfobject.embedSWF(
					'http://www.youtube.com/apiplayer?&enablejsapi=1&playerapiid=' + videoId,
					videoId, 
					o.videoWidth, 
					o.videoHeight, 
					'8', 
					null, 
					null, 
					o.params, 
					{ id: videoId },
					function(){
						player = document.getElementById( videoId );
					}
				);
			};
			
			$video.init();
			
		});
  };
})( jQuery );
