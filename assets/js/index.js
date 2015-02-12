var endpoint;

(function ($) {

    endpoint = $('#endpoint').html();

    $(document).ready(function () {

        var endpoint = $('#endpoint').html();

        // navegation
        $('.type').click(function (e) {
        
            e.preventDefault();
            var type = $(e.target).attr('data-type');
                json_source = endpoint + type;

            //debug
            console.log( 'action:click type:' + type + ' from:' + json_source );

            $.getJSON(json_source,
            function (data) {

                $("#types-data").innerHTML = '';
                $("#types-data").html('');

                table = '<table class="table table-striped tablesorter" id="list">'+
                        '<thead><tr><th>Item</th><th>Reputation</th></tr></thead> ';

                $('#types-data').html( table );

                $("#list").append( '<tbody>' );

                var itens = 0;
                $.each(data, function (key, value) {

                    line = '<tr><td><a onClick="show_item(this);" href="#" data-toggle="modal" data-target="#events-modal" data-type="' + type + '" data-item="' + value.item + '">' + value.item + '</a></td>' +
                                '<td><a onClick="show_edit_item(this);" href="#" data-toggle="modal" data-target="#edit-modal" data-type="' + type + '" data-item="' + value.item + '" data-rep="' + value.reputation + '">' + value.reputation + '</a></td></tr>';
                    $("#list").append( line );
                    itens++;
                });
                console.log( 'action:table itens:' + itens );

                if (itens == 0) {
                    $('#list').append('<tr><td>No data...</td><td></td><td></td></tr>');
                }

                $("#list").append( '</tbody>' );
                $('#types-data').append('</table><br />');
                $("#list").tablesorter( {sortList: [[1,0]]} );
            });
        });
    });
}(jQuery));

function show_item (e) {

    item = $(e).attr('data-item');
    type = $(e).attr('data-type');
    json_source = endpoint + 'events/' + type + '/' + item;

    console.log( 'action:show_item type:' + type + ' item:' + item + ' from:' + json_source );

    $.getJSON(json_source,
        function (data) {
                modal_header = $('.modal-header');
                modal_header.find('h4#label').html( type.toUpperCase() + ': ' + item );

                modal_data = $('.modal-body');

                $.each(data, function (key, value) {
                    var dateTime = new Date(value.timestamp * 1000);

                    line = '<tr><td>' + dateTime.toISOString().replace('T',"T\n") + '</td><td>' + value.category + '</td><td>' + value.msg.replace(/,/g,",\n"); + '</td></tr>';

                    modal_data.find('table#events-table').append( line );
                });

                $('#events-modal-footer').innerHTML = '';
                $('#events-modal-footer').html('');
                modal_buttons = $('#events-modal-footer');

                delete_bt = '<button type="button" class="btn btn-danger" data-item="' + item + '" data-type="' + type + '" onClick="delete_item(this);">Delete</button>';
                close_bt ='<button type="button" class="btn btn-error" data-dismiss="modal">Close</button>';

                modal_buttons.append( delete_bt );
                modal_buttons.append( close_bt );
        });
}

function delete_item (e) {

    item = $(e).attr('data-item');
    type = $(e).attr('data-type');
    json_source = endpoint + type + '/' + item;

    console.log( 'action:delete_item status:init type:' + type + ' item:' + item + ' from:' + json_source );

    if (confirm("Are you sure you want to delete the reputation?")) {
        console.log( 'action:delete_item status:confirmed type:' + type + ' item:' + item + ' from:' + json_source );
        $.ajax({
           url: json_source,
           type: 'DELETE'
        });
        location.reload();
    } else {
        console.log( 'action:delete_item status:canceled type:' + type + ' item:' + item + ' from:' + json_source );
    }
}
