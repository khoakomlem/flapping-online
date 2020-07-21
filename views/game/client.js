$(document).ready(() => {
    socket.emit('connected');
    $('#single').click(() => {
        $("#single").prop('disabled', true);
        var bird = { ...game.bird };
        game = new ClassicGame();
        Object.assign(game.bird, bird); // game.bird  <<<------------ bird
        game.bird.bloodBar = game.bloodBar;
        game.bird.fly();
        game.recordGame.input.push({ name: 'bird.fly', frame: 0, birdY: game.bird.y });
        $('#menu_button').fadeOut(200, () => {});
    })

    $('#pvp').click(() => {
        $("#pvp").prop('disabled', true);
        socket.emit('game req pvp');
        $('#menu_button').fadeOut(200, () => {});
    })

    $('#help').click(() => {
        Swal.fire({
            title: 'FAP FAP FAP',
            text: 'Click or press anykey to rush the bird fly and try to get the new high score!',
            icon: 'info'
        })
    })
    coin = getCookie('coin') || 0;
    $('#coin').html(coin);
})