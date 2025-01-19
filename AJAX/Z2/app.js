$(document).ready(function () {
    let lastOpened = null;
    const maxAlbums = 15;
    const maxPhotos = 32;

    $.get("https://jsonplaceholder.typicode.com/albums", function (albums) {
        const galleryList = $("#gallery-list");

        const albumsToDisplay = albums.slice(0, maxAlbums);
        albumsToDisplay.forEach(album => {
            const albumElement = $(`
                <div class="album" data-id="${album.id}">
                    <div class="album-title">
                        <h3>${album.title}</h3>
                    </div>
                    <div class="photos-container" style="display: none;"></div>
                </div>
            `);

            albumElement.find(".album-title").on("click", function () {
                const photosContainer = $(this).siblings(".photos-container");
                const description = $(this).siblings(".album-description");

                if (lastOpened && lastOpened !== photosContainer) {
                    lastOpened.slideUp();
                    $(".album-description").slideUp();
                }

                if (photosContainer.is(":visible")) {
                    photosContainer.slideUp();
                    description.slideUp();
                } else {
                    description.slideDown();
                    photosContainer.slideDown("slow", function () {
                        let offsetTop = albumElement.offset().top;
                        $('html, body').animate({
                            scrollTop: offsetTop - 10
                        }, 500);
                    });

                    if (!photosContainer.hasClass("loaded")) {
                        loadPhotos(album.id, photosContainer);
                    }
                }

                lastOpened = photosContainer.is(":visible") ? photosContainer : null;
            });

            galleryList.append(albumElement);
        });
    });

    function loadPhotos(albumId, container) {
        const seed = `album-${albumId}`;

        $.get(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`, function (photos) {
            const photosToDisplay = photos.slice(0, maxPhotos);
            photosToDisplay.forEach((photo, index) => {
                const miniImageUrl = `https://picsum.photos/seed/${seed}-${index}/150/150`;
                const fullImageUrl = `https://picsum.photos/seed/${seed}-${index}/1000/600`;

                const photoElement = $(`
                    <div class="photo">
                        <a href="${fullImageUrl}" data-lightbox="album-${albumId}">
                            <img src="${miniImageUrl}" alt="Photo">
                        </a>
                    </div>
                `);
                container.append(photoElement);
            });

            container.addClass("loaded");
        });
    }

    $("#photo-form").on("submit", function (event) {
        event.preventDefault();

        const formData = {
            albumId: $("#album-id").val(),
            title: $("#title").val(),
            url: $("#url").val(),
            thumbnailUrl: $("#thumbnail-url").val()
        };

        $.post("https://jsonplaceholder.typicode.com/photos", formData, function (response) {
            alert("Photo added successfully!");
            $("#photo-form")[0].reset();
        });
    });
});
