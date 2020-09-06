(function() {

  const serverUrl = 'http://127.0.0.1:3000';

  // A fetch request that periodically gets a swim command from the server
  const swimFetcher = () => {
    $.ajax({
      type: 'GET',
      url: serverUrl,
      success: (data) => {
        // call swim command
        SwimTeam.move(data);
      },
      complete: () => {
        // calls this only after completion of each AJAX request
        // never have multiple requests backing up
        setTimeout(swimFetcher, 1000);
      }
    });
  }
  // initial call
  //setTimeout(swimFetcher, 0);

  // A fetch request that periodically gets random swim commands from the server
  const randSwim = () => {
    $.ajax({
      type: 'GET',
      url: serverUrl + '/random',
      success: (data) => {
        // call swim command
        SwimTeam.move(data);
      },
      complete: () => {
        // calls this only after completion of each AJAX request
        // never have multiple requests backing up
        setTimeout(randSwim, 100);
      }
    });
  }
  // initial call to random
  randSwim();

  /////////////////////////////////////////////////////////////////////
  // The ajax file uploader is provided for your convenience!
  // Note: remember to fix the URL below.
  /////////////////////////////////////////////////////////////////////

  const ajaxFileUplaod = (file) => {
    var formData = new FormData();
    formData.append('file', file);
    $.ajax({
      type: 'POST',
      data: formData,
      url: serverUrl + '/background.jpg', // url in client must match url on server
      cache: false,
      contentType: false,
      processData: false,
      success: () => {
        // reload the page
        window.location = window.location.href;
      }
    });
  };

  $('form').on('submit', function(e) {
    e.preventDefault();

    var form = $('form .file')[0];
    if (form.files.length === 0) {
      console.log('No file selected!');
      return;
    }

    var file = form.files[0];
    if (file.type !== 'image/jpeg') {
      console.log('Not a jpg file!');
      return;
    }

    ajaxFileUplaod(file);
  });

})();
