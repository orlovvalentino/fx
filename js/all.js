'use strict';
function SortTable(table) {
    var table =     table,
        ths     =   [].slice.call(table.getElementsByTagName('th'));

    if(localStorage.getItem('tableState')) {
        sort(JSON.parse(localStorage.getItem('tableState'))['column'], JSON.parse(localStorage.getItem('tableState'))['desc']);
    }

    table.onclick = function (e) {
        if (e.target.tagName != 'TH' && e.target.parentNode.tagName !='TH') {
            return false;
        }else{
            var el = e.target.tagName == 'TH' ? e.target  : e.target.parentNode;
        }

        sort(el.cellIndex, el.classList.contains('desc'))
    }

    function sort (column, desc){

        var rowsArray = [].slice.call(table.tBodies[0].rows),
            tbody = table.tBodies[0],
            tableState =  {
                'column': column,
                'desc': desc
            },
            compare;
        ths.map(function (el) {
            el.classList.remove('current');
        });
        ths[column].classList.add('current');

        if(desc){
            ths[column].classList.remove('desc');
            compare = function(rowA, rowB) {
                return rowA.cells[column].dataset.value - rowB.cells[column].dataset.value;
            };
        }else{
            ths[column].classList.add('desc');
            compare = function(rowA, rowB) {
                return rowB.cells[column].dataset.value - rowA.cells[column].dataset.value;
            };
        }

        rowsArray.sort(compare);
        table.removeChild(tbody);

        for (var i = 0; i < rowsArray.length; i++) {
            tbody.appendChild(rowsArray[i]);
        }

        table.appendChild(tbody);
        localStorage.setItem('tableState', JSON.stringify(tableState));
    }
}
function Register(form){
    var form = form,
        button = form.submitButton;

    form.onsubmit = function() {
        button.disabled = true;
        setTimeout(function () {
            showSuccess();
        }, 2000);
        return false;
    }

    function showSuccess() {
        alert(form.name.value+', Вы зарегестрированы!')
    }

}

window.onload = function() {
    new Register(document.form);
    new SortTable(document.getElementById('table'));

    var youtube = document.querySelectorAll( ".youtube" );
    for (var i = 0; i < youtube.length; i++) {

        // thumbnail image source.
        var source = "https://img.youtube.com/vi/"+ youtube[i].dataset.embed +"/sddefault.jpg";
        var image = new Image();
        image.src = source;
        image.addEventListener( "load", function() {
            youtube[ i ].appendChild( image );
        }( i ) );
        youtube[i].addEventListener( "click", function() {

            var iframe = document.createElement( "iframe" );

            iframe.setAttribute( "frameborder", "0" );
            iframe.setAttribute( "allowfullscreen", "" );
            iframe.setAttribute( "src", "https://www.youtube.com/embed/"+ this.dataset.embed +"?rel=0&showinfo=0&autoplay=1" );

            this.innerHTML = "";
            this.appendChild( iframe );
        } );
    }
}
