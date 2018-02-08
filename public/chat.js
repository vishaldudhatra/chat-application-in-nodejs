// MAKE CONNECTION
var socket =  io.connect('http://192.168.1.200:9229');
$(document).ready(function(){
    // EMIT EVENT
    socket.emit('ref','');
});

$(document).on('click','#send',function () {
    // EMIT EVENT
    if($('#message').val()!='' && $('#handle').val()!='') {
        socket.emit('chat', {
            message: $('#message').val(),
            handle: $('#handle').val(),
        });
        $('#message').val('');
    }
});
$(document).on('keypress','#message',function(){
    if($('#handle').val()!='') {
        // EMIT EVENT
        socket.emit('typing', {'user':$('#handle').val()});
    }
});

// LISTENER
socket.on('chat',function(data){
    var html  = $('#output').html();
    html += '<p><strong>'+data.handle+': </strong>'+data.message+'</p>';
    $('#output').html(html);
    $('#chat-window').animate({scrollTop: $('#chat-window').prop("scrollHeight")},0);
});

// LISTENER
socket.on('typing',function(data){
    $('#feedback').html('<p><em>'+data.user+' is typing message...</em></p>');
});

// LISTENER
socket.on('ref',function(data){
    var html = '';
    $.makeArray(data).forEach(function(key){
        html += '<p><strong>'+key.user+': </strong>'+key.msg+'</p>';
    });
    $('#output').html(html);
    $('#chat-window').animate({scrollTop: $('#chat-window').prop("scrollHeight")},0);
});
