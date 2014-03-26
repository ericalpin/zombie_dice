// JavaScript Document
$(document).ready(function() {
	dice_pool = ['g','g','g','g','g','g','y','y','y','y','r','r','r'];
	g_dice_sides = ['Brain','Brain','Brain','Brain','Feet','Shotgun'];
	y_dice_sides = ['Brain','Brain','Feet','Feet','Shotgun','Shotgun'];
	r_dice_sides = ['Brain','Feet','Feet','Shotgun','Shotgun','Shotgun'];
	selected_dice = [];
	active_dice = dice_pool.slice();
	var dice_count = 13;
	var brain_count = 0;
	var feet_count = 0;
	var shotgun_count = 0;
	var player_1_total = 0;
	var player_2_total = 0;
	var player_1_turns = 0;
	var player_2_turns = 0;
	var end_game = 0;
	var curr_player = '';
	var old_player = '';
	
	function pick_dice () {
		var sel = active_dice[Math.floor(Math.random()*active_dice.length)];
		for (var x = 0; x < active_dice.length; x++) {
			if (active_dice[x] === sel) {
				break;
			}
		}
		selected_dice.push(sel);
		active_dice.splice(x, 1);
	}
	
	function toggle_player () {
		var $color_div = $("#color_div");
		var $results = $("#results");
		if (curr_player === '') { curr_player = 'player_1'; } else {
			switch (curr_player) {
				case 'player_1':
					curr_player = 'player_2';
					old_player = 'player_1';
					if (shotgun_count < 3) {
						player_1_total += brain_count;
					}
					player_1_turns++;
					break;
				case 'player_2':
					curr_player = 'player_1';
					old_player = 'player_2';
					if (shotgun_count < 3) {
						player_2_total += brain_count;
					}
					player_2_turns++;
					break;
			}
		}
		$('#player_1_score').val(player_1_total);
		$('#player_2_score').val(player_2_total);
		$('#player_1_turns').val(player_1_turns);
		$('#player_2_turns').val(player_2_turns);
		$color_div.html('');
		if (player_1_total >= 13 && (player_1_total > player_2_total) && (player_1_turns === player_2_turns)) {
			show_alert('Player 1 wins!', 'green', 4000);
			end_game = 1;
		}
		if (player_2_total >= 13 && (player_2_total > player_1_total) && (player_2_turns === player_1_turns)) {
			show_alert('Player 2 wins!', 'green', 4000);
			end_game = 1;
		}
		if (end_game === 0) {
			$("#" + old_player + "_lbl").css('font-weight','normal');
			$("#" + curr_player + "_lbl").css('font-weight','bold');
			selected_dice = [];
			active_dice = dice_pool.slice();
			brain_count = 0;
			feet_count = 0;
			shotgun_count = 0;
			dice_count = 13;
			$results.html('Brain Count: ' + brain_count + '   Shotgun Count: ' + shotgun_count);
		}
	}
	
	function show_alert (msg, color, sec) {
		$div = $("#alert_div");
		$text_div = $("#alert_text");
		var color_class = '';
		switch (color) {
			case 'red':
				color_class = 'red_text';
				break;
			case 'green':
				color_class = 'green_text';
		}
		$text_div.html(msg).addClass(color_class);
		$div.append($text_div).fadeIn(500);
		setTimeout(function () {
			$div.fadeOut(500);
		}, sec);
	}
	
	$("#select_dice").click(function () {
		var $color_div = $("#color_div");
		var $results = $("#results");
		var dice_num = 3 - selected_dice.length;
		var feet_dice = [], arr = [];
		$color_div.html('');
		if (active_dice.length < dice_num) { dice_num = active_dice.length }
		for (var x = 1; x <= dice_num; x++) {
			pick_dice();
		}
		for (var i = 0; i < selected_dice.length; i++) {
			var item = '';
			var dice_used;
			switch (selected_dice[i]) {
				case 'g':
					dice_used = g_dice_sides;
					break;
				case 'y':
					dice_used = y_dice_sides;
					break;
				case 'r':
					dice_used = r_dice_sides;
					break;
			}
			item = dice_used[Math.floor(Math.random()*dice_used.length)];
			switch (item) {
				case 'Brain':
					brain_count++;
					break;
				case 'Feet':
					feet_count++;
					break;
				case 'Shotgun':
					shotgun_count++;
					break;
			}
			$color_div.append('<div class="' + selected_dice[i] + '_dice dice">' + item + '</div>');
			if (shotgun_count >= 3) {
				show_alert('You rolled three shotguns!', 'red', 1500);
				setTimeout(function () {
					toggle_player();
				}, 2000);
			} else {
				if (item === 'Feet') {
					feet_dice.push(selected_dice[i]);
				}
			}
		}
		$results.html('Brain Count: ' + brain_count + '   Shotgun Count: ' + shotgun_count);
		selected_dice = feet_dice;
	});
	
	$("#end_turn").click(function () {
		toggle_player();
	});
	
	toggle_player();
});