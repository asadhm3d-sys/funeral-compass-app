/*
 * Kapselt Funktionalität des Buttons "Auf den Merkzettel"
 * 
*/
WishlistButton = function(id) {
    const me = this;
	let mzParentId = 0;
    let arId = 0;
    let xst = false;
    let syncBtn = null;
    let blocked = false;

    const btn = document.getElementById(id);
    if (btn !== null) { //Artikeldetails, Beratungsmappe, Konfigurator
        btn.addEventListener("click", toggleWishlist);
        xst = true;
        arId = parseInt( btn.getAttribute("data-id") );
        mzParentId = parseInt( document.querySelector("main").getAttribute("data-mz") );

        const hdl = document.getElementById("headl-nr");
        if (hdl !== null) {
            //Artikeldetails mit Varianten?
            const isVar = hdl.getAttribute("data-isvar");
            if (isVar === "no") {
                blocked = true;
                btn.classList.add("inactive");
                app.subscribe("variantSelected", function(id) {
                    blocked = false;
                    btn.classList.remove("inactive");
                    arId = parseInt(id);
                    btn.setAttribute("data-id", id);
                });
            }
        }

    }

    Object.defineProperty(this, 'exists', {
        get: function() {
            return xst;
        }
    });

    Object.defineProperty(this, 'syncButton', {
        set: function(val) {
            //konkurrierende Instanz von WishlistButton (2 Mal auf der Seite)
            syncBtn = val;
        }
    });

    Object.defineProperty(this, 'articleId', {
        get: function() {
            return arId;
        },
        set: function(val) {
            arId = val;
            btn.setAttribute("data-id", arId);
        }
    });

    function toggleWishlist() {
        if (!blocked) {
            let mzId = parseInt( btn.getAttribute("data-mz") );

            if (mzId === 0) {
                //auf Merkzettel setzen
                app.rq("wishlist_mng", {
                    "mz_id": mzId,
                    "ar_id": arId,
                    "pid": mzParentId
                }, function(resp) {
                    me.onWishlist(resp.id);
                    if (syncBtn !== null) syncBtn.onWishlist(resp.id);
                });
            }
            else {
                //von Merkzettel entfernen
                app.rq("wishlist_mng", { "mz_id": mzId }, function() {
                    me.onWishlist(0);
                    if (syncBtn !== null) syncBtn.onWishlist(0);
                });
            }
        }
    }

	// mzId > 0 heißt: ist auf Merkzettel
	this.onWishlist = function(mzId) {
		btn.setAttribute("data-mz", mzId);
		if (mzId == 0) {
			btn.setAttribute("data-mz", "0");
			btn.classList.remove("check");
			btn.innerText = "Auf den Merkzettel";
		}
		else {
			btn.setAttribute("data-mz", mzId);
			btn.classList.add("check");
			btn.innerText = "Ist auf dem Merkzettel";    
		}
	};
};