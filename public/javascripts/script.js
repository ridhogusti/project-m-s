

$('.editBtn').on('click', function () {
    //hide edit span
    $(this).closest("tr").find(".editSpan").hide();

    //show edit input
    $(this).closest("tr").find(".editInput").show();

    //hide edit button
    $(this).closest("tr").find(".editBtn").hide();

    //show edit button
    $(this).closest("tr").find(".saveBtn").show();

});

$('.saveBtn').on('click', function () {
    var rowEl = $(this).closest('tr');
    var ambilid = rowEl.find('.projectid').val();
    var ambiltext = rowEl.find('.editInput.name').val();
    // var editSpan = rowEl.find('.editSpan').text();
    // console.log(editSpan);
    console.log(ambilid);
    console.log(ambiltext);
    $.ajax({
        type: 'POST',
        url: './../users/project/edit/',
        dataType: "json",
        data: { id: ambilid, name: ambiltext },
        success: function (response) {
            if (response.status == 'ok') {
                console.log(response.data);
                rowEl.find(".editSpan.name").text(response.data[0]);

                rowEl.find(".editInput.name").text(response.data[0]);

                rowEl.find(".editInput").hide();
                rowEl.find(".saveBtn").hide();
                rowEl.find(".editSpan").show();
                rowEl.find(".editBtn").show();
            } else {
                alert(response.msg);
            }
        }
    });
});

$('.deleteBtn').on('click',function(){
    //hide delete button
    $(this).closest("tr").find(".deleteBtn").hide();
    
    //show confirm button
    $(this).closest("tr").find(".confirmBtn").show();
    
});

$('.confirmBtn').on('click',function(){
    var trObj = $(this).closest("tr");
    var ID = $(this).closest("tr").attr('id');
    var rowEl = $(this).closest('tr');
    var ambilid = rowEl.find('.projectid').val();
    $.ajax({
        type:'POST',
        url:'../users/project/delete/',
        dataType: "json",
        data: { id: ambilid },
        success:function(response){
            if(response.status == 'ok'){
                trObj.remove();
            }else{
                trObj.find(".confirmBtn").hide();
                trObj.find(".deleteBtn").show();
                alert(response.msg);
            }
        }
    });
});


$('#new-todo-form').submit(function (e) {
    e.preventDefault();

    var toDoItem = $(this).serialize();
    console.log(toDoItem);

    $.post('/users/todos', toDoItem, function (data) {
        $('#todo-list').append(
            `
            <li class="list-group-item">
            <form action="/todos/${data._id}" method="POST" class="edit-item-form">
                <div class="form-group">
                    <label for="${data._id}">Item Text</label>
                    <input type="text" value="${data.text}" name="todo[text]" class="form-control" id="${data._id}">
                </div>
                <button class="btn btn-primary">Update Item</button>
            </form>
                <span class="lead">
                    ${data.text}
                </span>
                <div class="pull-right">
                    <button class="btn btn-sm btn-warning edit-button">Edit</button>
                    <form style="display: inline" method="POST" action="/todos/${data._id}" class="delete-item-form">
                        <button type="submit" class="btn btn-sm btn-danger">Delete</button>
                    </form>
                </div>
                <div class="clearfix"></div>
            </li>
            `
        )
        $('#new-todo-form').find('.form-control').val('');
    });
});

$('#get-button').on('click', function () {
    $.ajax({
        url: '/users/todos',
        method: 'GET',
        contentType: 'application/json',
        success: function (response) {
            var tbodyEl = $('tbody');

            tbodyEl.html('');


            response.data.forEach(function (product) {
                tbodyEl.append('\
                        <tr>\
                            <td class="id">' + product.id + '</td>\
                            <td><input type="text" class="name" value="' + product.text + '"></td>\
                            <td>\
                                <button class="update-button">UPDATE/PUT</button>\
                                <button class="delete-button">DELETE</button>\
                            </td>\
                        </tr>\
                    ');
            });
        }
    });
});
// CREATE/POST
$('#create-form').on('submit', function (event) {
    event.preventDefault();

    var createInput = $('#create-input');
    console.log(createInput.val());
    console.log('testasoenuthaseotuhn');

    $.ajax({
        url: '/users/todos',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name: createInput.val() }),
        success: function (response) {
            console.log(response);
            createInput.val('');
            $('#get-button').click();
        }
    });
});