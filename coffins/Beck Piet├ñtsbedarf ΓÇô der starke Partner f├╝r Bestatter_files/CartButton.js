/*
 * Kapselt Funktionalität des Buttons "In den Warenkorb"
 * Constructor erwartet Selektoren für
 * form = Formular in dem der Button sitzt
 * selButton = In den Warenkorb
 * selNum = input Anzahl der Artikel
 * selRem = textarea/input Anmerkung
 * selErr = Bereich für Fehlertext Menge
 * 
*/
CartButton = function(form, selButton, selNum, selRem, selErr) {
    if (form === null) return;
    
    const myForm = form;

    //state
    let active = true;
    let busy = false;
    let isFolder = false;
    let wlId = 0;
    //dom
    const cartShowNum = document.getElementById("cart-shownum");
    const button = domSelect(selButton);
    const num = domSelect(selNum);
    const rem = domSelect(selRem);
    const err = domSelect(selErr);

    //Merkzettel-Ordner?
    const inp = form.querySelector('input[name="mz_id"]');
    isFolder = (inp !== null);
    if (isFolder) wlId = parseInt(inp.value);

    //Fehlermeldung ausblenden
    if (num !== null && err !== null) {
        num.addEventListener("change", function() {
            err.style.display = "none";
        });
    }

    myForm.addEventListener("submit", function(e) {
        e.preventDefault();
        e.stopPropagation();
        var btn = e.submitter.getAttribute("name");
        if (btn == "wk") {
            if (!busy && active) {
                const res = getCartData();
                if (res !== false) {
                    toggleCartBusy();
                    app.rq("cart", res, onArticleInCart);
                }
                else {
                    err.style.display = "block";
                }
            }
        }
    });

    function getCartData() {
        let resp = false;
        if (isFolder) {
            resp = {
                task: "+",
                menge: 0,
                anm: "",
                bestattung: "",
                id: 0,
                mz: wlId
            };
        }
        else {
            let anz = (num === null) ? 1 : num.value;
            if (anz.length > 0) {
                anz = parseInt(anz);
                const inpBest = myForm.querySelector('input[name="bestattung"]');
                const best = (inpBest === null) ? "" : inpBest.value;
                if (anz > 0) {
                    resp = {
                        task: "+",
                        menge: anz,
                        anm: (rem === null) ? "" : rem.value,
                        bestattung: best,
                        id: myForm.querySelector('input[name="id"]').value,
                        mz: 0
                    };
                }
            }    
        }
        return resp;
    }

    function toggleCartBusy() {
        const spans = button.querySelectorAll("span");
        if (busy) {
            //busy off
            spans[1].style.display = "none";
            spans[0].style.display = "inline";
            busy = false;
        }
        else {
            //busy on
            spans[0].style.display = "none";
            spans[1].style.display = "inline-block";
            busy = true;
        }
    }

    function onArticleInCart(resp) {
        toggleCartBusy();
        const numAr = isFolder ? -1 : resp.num;
        cartFull(numAr);
        cartShowNum.innerText = "(" + resp.total + ")";
    }

    function cartFull(num) {
        let isGreen = (num > 0);
        let txt = "";
        if (num == -1) {
            txt = "Artikel hinzugefügt";
            isGreen = true;
        }
        else if (num == 0) {
            txt = "In den Warenkorb";
        }
        else {
            txt = (num == 1) ? "Ist im Warenkorb" :  num + " &times; im Warenkorb";
        }
        button.querySelector("span.txt").innerHTML = txt;
        if (isGreen) {
            button.classList.remove("dark");
            button.classList.add("green");
        }
        else {
            button.classList.remove("green");
            button.classList.add("dark");
        }
    }

    function domSelect(selector) {
        let elm = null;
        if (typeof selector === "undefined") selector = null;
        if (selector !== null) {
            if (selector.indexOf("form:") === 0) {
                //Suche in form des Buttons
                selector = selector.substr(5);
                elm = myForm.querySelector(selector);
            }
            else if (selector.indexOf("name:") === 0) {
                //Suche nach name-Attribut in form des Buttons
                const name = selector.substr(5);
                elm = myForm.querySelector('*[name="' + name + '"]');
            }
            else if (selector.indexOf("box:") === 0) {
                //Suche in Box des Artikels (Merkzettel)
                selector = selector.substr(4);
                const box = myForm.closest("*.ar-box");
                elm = box.querySelector(selector);
            }
            else {
                //Suche im ganzen Dokument
                elm = document.querySelector(selector);
            }
        }
        return elm;
    }

    this.checkInCart = function(id) {
        var url = app.home + "xhr/in_cart.php?id=" + id;
        fetch(url).then(function(resp) {
            resp.json().then(function(data) {
                cartFull(data.inCart);
            });
        });
    };

    Object.defineProperty(this, 'active', {
        get: function() {
            return active;
        },
        set: function(val) {
			if (active != val) {
				active = val;
                if (active) {
                    button.classList.remove("inactive");
                }
                else {
                    button.classList.add("inactive");
                }
			}
        }
    });
    
};