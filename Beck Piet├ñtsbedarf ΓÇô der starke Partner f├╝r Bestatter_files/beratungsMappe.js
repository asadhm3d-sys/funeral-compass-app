const beratungsMappe = (function ()
{
    const me = {};
    const cur = {
        categId: 0,
        index: 0
    };
    let artikel = [];
    let artikelBoxes = [];
    let userId = 0;
    let stage = null;
    let fTempl = null;
    let btnNext = null;
    let btnPrev = null;
    let recallIndex = null;
    let index = 0;
    let max = 0;

    let categBox = null;
    let categTree = null;
    let categMap = [];
    let createCategButton = null;

    let listBox = null;
    let mzParentId = 0;
    let createArticleButton = null;
    let adminButton = null; // Beratungsmappe -> Bearbeiten

    function goPrev() {
        if (index > 0) {
            hideCurrent();
            index--;
            showCurrent();
        }
    }
    function goNext() {
        if (index < max) {
            hideCurrent();
            index++;
            showCurrent();
        }
    }

    function hideCurrent() {
        artikelBoxes[index].style.display = "none";
    }

    function showCurrent() {
        artikelBoxes[index].style.display = "block";
        cur.index = index;
        localStorage.setItem("beck.vm.current", JSON.stringify(cur));
    }

    /* *************************** KATEGORIEN */

    function browseCategories(list) {
        for (let k, i = 0; i < list.length; i++) {
            k = list[i];
            if (k.menu_name !== null && k.menu_name.length > 0) {
                k.name = k.menu_name;
            }
            categMap[k.id] = k;

            if (k.children.length > 0) {
                browseCategories(k.children);
            }
        }
    }

    function showCategories(list) {
        let html = "";
        for (let ctg, i = 0; i < list.length; i++) {
            ctg = list[i];
            html += createCategButton(ctg);
        }
        categBox.innerHTML = html;
    }

    function onCategClick(id) {
        if (id == 0) {
            /*
             * Ursprüngl. auch hier [...] loadArticlesOf(id)
             * Das hat alle Kindkategorien im Root zur Auswahl gestellt
            */
            window.location.href = app.home + "mappestart";
        }
        else {
            let list = buildBreadCrumb(id);
            showCategories(list);
            loadArticlesOf(id);
        }
    }

    function loadArticlesOf(categId) {
        app.rq("vendor_map", { kategid: categId, uid: userId }, function(resp) {
            artikel = [];
            artikelBoxes = [];
            index = 0;
            if (resp.length > 0) {
                let html = "";
                for (let ar, i = 0; i < resp.length; i++) {
                    ar = JSON.parse(resp[i]);
                    artikel.push(ar);
                    if (ar.bilder === null) console.log(ar);
                    html += createArticleButton(ar);
                }
                listBox.innerHTML = html;
                createArticleHTML();

                if (recallIndex !== null) {
                    index = recallIndex;
                    recallIndex = null;
                }
                showCurrent();

                cur.categId = categId;
                localStorage.setItem("beck.vm.current", JSON.stringify(cur));
                if (adminButton !== null) {
                    adaptAdminButton(categId);
                }
            }
        }, "get");
    }

    function adaptAdminButton(categId) {
        let content = adminButton.getAttribute("data-content");
        const arr = content.split("-");
        content = arr[0] + "-" + categId;
        adminButton.setAttribute("data-content", content);
    }

    function buildBreadCrumb(categId) {
        //walk up
        let list = getParentCategories(categId);
        //walk down
        let children;
        if (categId == 0) {
            children = categTree;
        }
        else {
            children = categMap[categId].children;
        }
        if (children.length > 0) {
            for (let cc, c = 0; c < children.length; c++) {
                cc = children[c];
                list.push({
                    id: cc.id,
                    name: cc.name,
                    active: false
                });
            }
        }
        //mark current
        for (let i = 0; i < list.length; i++) {
            if (list[i].id == categId) {
                list[i].active = true;
                break;
            }
        }
        return list;
    }

    function getParentCategories(categId) {
        let items = [];
        let ctg;
        while (categId > 0) {
            ctg = categMap[categId];
            items.push({
                id: categId,
                name: ctg.name,
                active: false
            });
            categId = ctg.pid;
        }
        items.push({
            id: 0,
            name: "", //root
            active: false
        });
        if (items.length > 1) items.reverse();
        return items;
    }

    /* *************************** ARTIKEL */
    
    function createArticleHTML() {
        stage.innerHTML = "";
        max = artikel.length - 1;
        for (let box, i = 0; i < artikel.length; i++) {
            box = document.createElement("div");
            box.style.display = "none";
            box.innerHTML = fTempl(artikel[i]);
            artikelBoxes.push(box);
            stage.appendChild(box);
        }
    }

    function getIndexOf(id) {
        let ndx = -1;
        for (let i = 0; i < artikel.length; i++) {
            if (artikel[i].id == id) {
                ndx = i;
                break;
            }
        }
        return ndx;
    }

    function showArticle(ndx) {
        if (index !== ndx) {
            artikelBoxes[index].style.display = "none";
            artikelBoxes[ndx].style.display = "block";
            index = ndx;
            cur.index = index;
            localStorage.setItem("beck.vm.current", JSON.stringify(cur));    
        }
    }

    /* *************************** MERKZETTEL */
    function toggleWishlist(btn) {
        let mzId = parseInt( btn.getAttribute("data-mz") );
        let arId = parseInt( btn.getAttribute("data-id") );

        if (mzId === 0) {
            //auf Merkzettel setzen
            app.rq("wishlist_mng", {
                "mz_id": mzId,
                "ar_id": arId,
                "uid": userId, //OBSOLET
                "pid": mzParentId
            }, function(resp) {
                btn.setAttribute("data-mz", resp.id);
                btn.classList.add("check");
                btn.innerText = "Ist auf dem Merkzettel";
            });
        }
        else {
            //von Merkzettel entfernen
            app.rq("wishlist_mng", { "mz_id": mzId }, function() {
                btn.setAttribute("data-mz", "0");
                btn.classList.remove("check");
                btn.innerText = "Auf den Merkzettel";    
            });
        }
    }

    me.init = function() {
        let templHtml;
        const main = document.getElementById("main");
        userId = main.getAttribute("data-uid");
        adminButton = document.querySelector('a[data-role="vendor-admin"]');
        
        //navigation
        btnNext = document.getElementById("artikel-next");
        btnPrev = document.getElementById("artikel-prev");
        if (btnNext !== null) {
            btnNext.addEventListener("click", goNext);
            btnPrev.addEventListener("click", goPrev);    
        }

        //categories
        categBox = document.getElementById("categ-box");
        if (categBox !== null) {
            categTree = JSON.parse(document.getElementById('kategorien-baum').innerHTML);
            browseCategories(categTree);
            templHtml = document.getElementById("kateg-templ").innerHTML;
            createCategButton = window.tmpl(templHtml);
            const bc = buildBreadCrumb(0);
            showCategories(bc);
    
            categBox.addEventListener("click", function(e) {
                const div = e.target.closest("div");
                if (div.classList.contains("categ-btn")) {
                    const span = div.querySelector("span");
                    if ( !span.classList.contains("active") ) {
                        onCategClick(div.getAttribute("data-id"));
                    }
                }
            });    
        }

        //artikelliste
        listBox = document.getElementById("articles-listbox");
        if (listBox !== null) {
            templHtml = document.getElementById("arbutton-templ").innerHTML;
            createArticleButton = window.tmpl(templHtml);

            listBox.addEventListener("click", function(e) {
                const div = e.target.closest("div.ar-btn");
                const id = div.getAttribute("data-id");
                const i = getIndexOf(id);
                if (i >= 0) {
                    showArticle(i);
                }
            });
        }

        //artikeldetails
        stage = document.getElementById("artikel-stage");
        templHtml = document.getElementById("artikel-templ").innerHTML;
        fTempl = window.tmpl(templHtml);

        //Merkzettel
        main.addEventListener("click", function(e) {
            if (e.target.tagName === "SPAN") {
                if (e.target.hasAttribute("data-mz")) {
                    toggleWishlist(e.target);
                }
            }
        });

        //was darstellen?
        const cont = document.getElementById("mapcontainer");
        mzParentId = parseInt( cont.getAttribute("data-mz") );
        const cid = parseInt( cont.getAttribute("data-categ") );
        if (cid == 0) {
            //direkter Aufruf (nicht von mappestart)
            //Zustand aus storage wieder herstellen
            let stored = JSON.parse(localStorage.getItem("beck.vm.current"));
            if (stored !== null) {
                recallIndex = stored.index;
                onCategClick(stored.categId);
            }
        }
        else {
            onCategClick(cid);
        }
    };

    return me;
})();
$(document).ready(function(){
	beratungsMappe.init();
});
