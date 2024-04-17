// NanoBaseCallbacks is where the base callbacks (common to all templates) are stored
NanoBaseCallbacks = (function () {
  // _canClick is used to disable clicks for a short period after each click (to avoid mis-clicks)
  let _canClick = true;

  let _baseBeforeUpdateCallbacks = {};

  let _baseAfterUpdateCallbacks = {
    // this callback is triggered after new data is processed
    // it updates the status/visibility icon and adds click event handling to buttons/links
    status: function (updateData) {
      let uiStatusClass;
      if (updateData['config']['status'] == 2) {
        uiStatusClass = 'icon24 uiStatusGood';
        $('.linkActive').removeClass('inactive');
      } else if (updateData['config']['status'] == 1) {
        uiStatusClass = 'icon24 uiStatusAverage';
        $('.linkActive').addClass('inactive');
      } else {
        uiStatusClass = 'icon24 uiStatusBad';
        $('.linkActive').addClass('inactive');
      }
      $('#uiStatusIcon').attr('class', uiStatusClass);

      $('.linkActive').stopTime('linkPending');
      $('.linkActive').removeClass('linkPending');

      $('.linkActive')
        .off('click')
        .on('click', function (event) {
          event.preventDefault();
          let href = $(this).data('href');
          if (href != null && _canClick) {
            _canClick = false;
            $('body').oneTime(300, 'enableClick', function () {
              _canClick = true;
            });
            if (updateData['config']['status'] == 2) {
              $(this).oneTime(300, 'linkPending', function () {
                $(this).addClass('linkPending');
              });
            }
            window.location.href = href;
          }
        });

      return updateData;
    },
    nanomap: function (updateData) {
      $('.mapIcon')
        .off('mouseenter mouseleave')
        .on('mouseenter', function (event) {
          $('#uiMapTooltip')
            .html($(this).children('.tooltip').html())
            .show()
            .stopTime()
            .oneTime(5000, 'hideTooltip', function () {
              $(this).fadeOut(500);
            });
        });

      $('.zoomLink')
        .off('click')
        .on('click', function (event) {
          event.preventDefault();
          let zoomLevel = $(this).data('zoomLevel');
          let uiMapObject = $('#uiMap');
          let uiMapWidth = uiMapObject.width() * zoomLevel;
          let uiMapHeight = uiMapObject.height() * zoomLevel;

          uiMapObject.css({
            zoom: zoomLevel,
            left: '50%',
            top: '50%',
            marginLeft: '-' + Math.floor(uiMapWidth / 2) + 'px',
            marginTop: '-' + Math.floor(uiMapHeight / 2) + 'px',
          });
        });

      $('#uiMapImage').attr(
        'src',
        updateData['config']['mapName'] +
          '-' +
          updateData['config']['mapZLevel'] +
          '.png'
      );

      return updateData;
    },
  };

  return {
    addCallbacks: function () {
      NanoStateManager.addBeforeUpdateCallbacks(_baseBeforeUpdateCallbacks);
      NanoStateManager.addAfterUpdateCallbacks(_baseAfterUpdateCallbacks);
    },
    removeCallbacks: function () {
      for (let callbackKey in _baseBeforeUpdateCallbacks) {
        if (_baseBeforeUpdateCallbacks.hasOwnProperty(callbackKey)) {
          NanoStateManager.removeBeforeUpdateCallback(callbackKey);
        }
      }
      for (let callbackKey in _baseAfterUpdateCallbacks) {
        if (_baseAfterUpdateCallbacks.hasOwnProperty(callbackKey)) {
          NanoStateManager.removeAfterUpdateCallback(callbackKey);
        }
      }
    },
  };
})();
