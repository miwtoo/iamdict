<?
    // inculde connect.php
    include("config/connect.php");

    // lib functions php
    include("php/lib_func.php");

    date_default_timezone_set("Asia/Bangkok"); // set timezone
?>
<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<title>IamDict</title>

<link rel="stylesheet" type="text/css" href="css/style.css?v0.7">
<link rel="shortcut icon" type="image/x-icon" href="images/icon/logo-small.png">

<script type="text/javascript" src="js/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="js/iamdict.js?v=1.1"></script>
<script type="text/javascript" src="js/jquery-scrolltofixed.js"></script>
<!--<script type="text/javascript" src="js/chart.js"></script>-->
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>

<!-- lib games -->
<script type="text/javascript" src="js/lib_games/game.js"></script>
<script type="text/javascript" src="js/lib_games/speaking.js"></script>
<script type="text/javascript" src="js/lib_games/listening.js"></script>

<!-- Add fancyBox main JS and CSS files -->
<script type="text/javascript" src="js/jquery.fancybox.pack.js"></script>
<link rel="stylesheet" type="text/css" href="css/fancybox/jquery.fancybox.css" media="screen" />
<script type="text/javascript">
    $(document).ready(function() {
        $('.fancybox_popup').fancybox({
            margin: [-100, 0, 0, 0]
        });

        <?
        // welcome popup
        if($_SESSION["welcome"]) {
        ?>

        $("#popup_welcome").fancybox({margin: [-100, 0, 0, 0]}).trigger('click');

        <?
        // clear session
        unset($_SESSION["welcome"]);
        }
        ?>
    });
</script>

<script type="text/javascript">
    $(document).ready(function(){
        get_Dict( user_info.data.user_id );
        get_newWord( user_info.data.user_id );
    });

    $(window).load(function(){
        pageLoading( 0 );
    });
</script>

</head>

<body>

    <?
    // alert login failed
    if( isset($_GET["login"]) == "failed" )
    {
        // alert login failed
        echo '<div class="alert"><span style="background: red;">Check your username or password.</span></div>';
        echo '<script>$(function(){ $(window).load(function(){ $(".login-form .username").focus(); }); });</script>';
    }

    // alert register success
    if( isset($_GET["register"]) == "success" )
    {
        // alert register success
        echo '<div class="alert"><span style="background: #8CC63F;">Register has been successful. You can login right now.</span></div>';
        echo '<script>$(function(){ $(window).load(function(){ $(".login-form .password").focus(); }); });</script>';
    }
    ?>

    <input type="hidden" id="iamdict-user-info" data-user='{"user_id":"<?=$user_id;?>"}'>

    <!-- no login -->
    <?
    if( !$user_id ) {
    ?>
    <div id="no-login">
        <div class="no-login-inner">
            <div class="logo">
                <i class="icon-iamdict"></i>
                <strong>IamDict</strong>
            </div>
            <div class="about-iamdict style-no-login">
                <div class="content">
                    <h4>IamDict ?</h4>
                    <p>IamDict คือสมุดจดบันทึกคำศัพท์ภาษาอังกฤษ</p>
                </div>
                <div class="content">
                    <h4>IamDict ช่วยเราในการ :</h4>
                    <ul>
                        <li>• จดบันทึกคำศัพท์</li>
                        <li>• เครื่องมือจัดการคำศัพท์</li>
                        <li>• ฝึกทักษะการพูด, ฟัง, เขียน ภาษาอังกฤษ</li>
                    </ul>
                </div>
            </div>
            <div class="login-form style-no-login">
                <form action="login.php" method="post">
                    <input type="text" class="username style-input" name="username" placeholder="Username" required="required" value="<?=$_GET['username'];?>">
                    <input type="password" class="password style-input" name="password" placeholder="Password" required="required">
                    <input type="submit" class="submit" value="Log in">
                    <div class="footer">
                        <label><span>remember me</span> <input type="checkbox" class="checkbox" name="loggin" checked></label>
                        <a class="fancybox_popup" href="#popup_forgetPassword" onClick="clear_forgetPass()">Forget password ?</a>
                    </div>
                </form>
            </div>
            <div class="register-form style-no-login">
                <div class="header">
                    Create dictionary? Register
                </div>
                <form action="register.php" method="post" id="register" onsubmit="Javascript: return checkForm_register();">
                    <input type="text" class="username style-input" name="username" placeholder="Username" onchange="checkInput_username(this.value);">
                    <input type="email" class="email style-input" name="email" placeholder="Your email">
                    <input type="password" class="password style-input" name="password" placeholder="Your password" maxlength="20">
                    <label class="birthday">
                        <div>Birthday</div>
                        <select name="birthday_day">
                            <option value="">Day</option>
                            <? for($i=1;$i<=31;$i++) {?>
                            <option><?=$i;?></option>
                            <? }?>
                        </select>
                        <select name="birthday_month" style="width: 80px;">
                            <option value="">Month</option>
                            <? for($i=1;$i<=12;$i++) {?>
                            <option value="<?=$i;?>"><?=get_nameMonth($i);?></option>
                            <? }?>
                        </select>
                        <select name="birthday_year">
                            <option value="">Year</option>
                            <?
                            $date = date("Y");
                            for($i=$date;$i>=1974;$i--) {
                            ?>
                            <option><?=$i;?></option>
                            <? }?>
                        </select>
                    </label>
                    <label class="gender">
                        <input type="radio" name="gender" value="female"> <span>Female</span>
                    </label>
                    <label class="gender">
                        <input type="radio" name="gender" value="male"> <span>Male</span>
                    </label>
                    <input type="submit" class="submit" value="Create a Dictionary">
                </form>
            </div>
        </div>
    </div>

    <?
    } else {

    // get user info
    $db -> select("SELECT * FROM user_info WHERE user_id = '".$user_id."'");
    $res = $db -> getResult();

    // data
    $username = $res[0]["user_name"];
    $email    = $res[0]["email"];

    ?>

    <!-- logged -->

    <div id="loading-display"><span>Loading...</span></div>

    <div id="logged">
    	<header>
        	<div class="logo">
            	<a href="<?php $_SERVER['SERVER_NAME']; ?>">
                	<i class="sprites"></i>
                    <span>IamDict</span>
                </a>
            </div>
            <div class="bar">
            	<div class="search">
                	<input type="text" class="search-word" id="search-word-home" placeholder="Search word" onkeyup="search( this, 'home' );">
                    <i class="sprites" onClick="close_search('home');"></i>
                </div>
                <div class="user">
                	<a onClick="option_user();">
                        <!--<img src="https://pbs.twimg.com/profile_images/445551802713264128/FWz5ZHFQ.jpeg">-->
                        <span><?=$username;?></span>
                        <i class="sprites icon-option" id="btn-icon-option"></i>
                    </a>
                    <div class="option" id="option-user">
                    	<i class="sprites bg-top-arrow"></i>
                    	<ul>
                        	<li><a class="fancybox_popup" href="#popup_help">Help ?</a></li>
                        	<li><a href="logout.php">Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>

        <script type="text/javascript">
            function option_user () {
                var $option_user = $('#option-user');
                var $btn_icon_option = $('#btn-icon-option');
                var status = $option_user.css("display");

                if( status == "none" )
                {
                  $option_user.fadeIn(100);
                  $btn_icon_option.css("background-position","-37px -197px");
                }
                else
                {
                  $option_user.hide();
                  $btn_icon_option.css("background-position","-59px -197px");
                }
            }
        </script>

        <div id="wrapper">
        	<ul class="nav">
            	<li class="list feed" id="new_word">
                	<strong class="topic">New words of today ( <span class="count">0</span> )</strong>
                    <ul></ul>
                </li>
                <li class="list add common" onClick="clickPopup_Page('#add-page');">
                	<i class="sprites"></i>
                    <span>+ Add Word</span>
                </li>
                <li class="list dict common" id="mydict-nav" onClick="clickPopup_Page('#dict-page');">
                	<i class="sprites"></i>
                    <span>My Dictionary ( <span class="count" id="count_words">0</span> )</span>
                </li>
                <li class="list game common" onClick="clickPopup_Page('#game-page');">
                	<i class="sprites"></i>
                    <span>Play game</span>
                </li>
                <li class="list graph common" onClick="clickPopup_Page('#chart-page');">
                	<i class="sprites"></i>
                    <span>View Chart</span>
                </li>
            </ul>

             <ul class="lists-result" id="mydict-result-home" style="display: none;"></ul>
        </div>
    </div>

    <? }?>

    <!-- footr -->
    <footer style="display: block;">
        <a class="fancybox_popup" href="#popup_help">help</a>
        <a class="fancybox_popup" href="#popup_about">about</a>
        <a href="mailto:contact@iamdict.com">feedback</a>
        <div>IamDict &copy; <?=date("Y");?> created by <a href="https://twitter.com/_CHAI__" target="_blank">Apichai Densamut</a></div>
    </footer>


    <!-- add -->
    <div id="add-page" class="popup-page-common scale add-page">
    	<div class="header-bar">
        	<div class="left">
            	<a>
                    <i class="icon sprites"></i>
                    <strong>+ Add Word</strong>
                </a>
            </div>
            <div class="right">
            	<button class="btn-back-to-home sprites" onClick="clickClose_Page( '#add-page' );">Back</button>
            </div>
        </div>
        <div class="wrapper">
        	<div class="main"><!-- load html --></div>
        </div>
    </div>

    <!-- dict -->
    <div id="dict-page" class="popup-page-common scale">
    	<div class="header-bar">
        	<div class="left">
            	<a>
                    <i class="icon sprites"></i>
                    <strong>My Dictionary</strong>
                </a>
                <div class="search">
                	<input type="text" class="search-word" id="search-word-mydict" placeholder="Search word" onkeyup="search( this, 'mydict' );">
                    <i class="sprites" onClick="close_search('dict');"></i>
                </div>
            </div>
            <div class="right">
            	<button class="btn-back-to-home sprites" onClick="clickClose_Page( '#dict-page' );">Back</button>
            </div>
        </div>
        <div class="wrapper">
        	<div class="main">
                <ul class="lists-result dict-page" id="mydict" style="margin-top: 80px;">
                	<!-- load ajax -->
                </ul>
            </div>
        </div>

        <ul class="sorting-char">
            <li onClick="scrollTo_ChatAt( this, 'a' );" class="active">a</li>
            <li onClick="scrollTo_ChatAt( this, 'b' );">b</li>
            <li onClick="scrollTo_ChatAt( this, 'c' );">c</li>
            <li onClick="scrollTo_ChatAt( this, 'd' );">d</li>
            <li onClick="scrollTo_ChatAt( this, 'e' );">e</li>
            <li onClick="scrollTo_ChatAt( this, 'f' );">f</li>
            <li onClick="scrollTo_ChatAt( this, 'g' );">g</li>
            <li onClick="scrollTo_ChatAt( this, 'h' );">h</li>
            <li onClick="scrollTo_ChatAt( this, 'i' );">i</li>
            <li onClick="scrollTo_ChatAt( this, 'j' );">j</li>
            <li onClick="scrollTo_ChatAt( this, 'k' );">k</li>
            <li onClick="scrollTo_ChatAt( this, 'l' );">l</li>
            <li onClick="scrollTo_ChatAt( this, 'm' );">m</li>
            <li onClick="scrollTo_ChatAt( this, 'n' );">n</li>
            <li onClick="scrollTo_ChatAt( this, 'o' );">o</li>
            <li onClick="scrollTo_ChatAt( this, 'p' );">p</li>
            <li onClick="scrollTo_ChatAt( this, 'q' );">q</li>
            <li onClick="scrollTo_ChatAt( this, 'r' );">r</li>
            <li onClick="scrollTo_ChatAt( this, 's' );">s</li>
            <li onClick="scrollTo_ChatAt( this, 't' );">t</li>
            <li onClick="scrollTo_ChatAt( this, 'u' );">u</li>
            <li onClick="scrollTo_ChatAt( this, 'v' );">v</li>
            <li onClick="scrollTo_ChatAt( this, 'w' );">w</li>
            <li onClick="scrollTo_ChatAt( this, 'x' );">x</li>
            <li onClick="scrollTo_ChatAt( this, 'y' );">y</li>
            <li onClick="scrollTo_ChatAt( this, 'z' );">z</li>
        </ul>
    </div>

	<script>
        // page dict
		function Storage_scroll_dict() {
			this.scrollTop = 0;
		}
		var storage_scroll_dict = new Storage_scroll_dict();

		function reset_storage_scroll_dict() {
			storage_scroll_dict.scrollTop = 0;
		}

		// scrollTop of dict page
		var $wrap = $('#dict-page');
		var $el = $('#dict-page .header-bar');
		var w = $(window).outerWidth(true) - getScrollbarWidth();
		var tmp = 0;
		var result = 0;
		var top_popupWordDetail = 0;

        // event
		$($wrap).scroll(function(){

			if(document.getElementById("popup-word-detail") != null) {
				top_popupWordDetail = $("#popup-word-detail").offset().top;
			}

			if( $(this).scrollTop() > tmp )
			{
				// down
				var result = top_popupWordDetail - ($(this).scrollTop() - tmp);
			}
			else
			{
				// up
				var result = (top_popupWordDetail + tmp) - $(this).scrollTop();
			}

			$('#popup-word-detail').css({ top: result + 'px' });

			storage_scroll_dict.scrollTop = $(this).scrollTop();

			tmp = $(this).scrollTop();

			if( $(this).scrollTop()) {
				$el.css({ position: "absolute", top: $(this).scrollTop() + "px", left: "0px", width: w + "px" });
			} else {
				$el.css({ position: "absolute", top: "0px", left: "0px", width: w + "px" });
			}
		});

        $($wrap).scroll(function(){

            if( $(this).scrollTop() > 0 ) {

                $(".sorting-char").css({ top: $(this).scrollTop() + 80 + "px" });
            } else {
                $(".sorting-char").css({ top: "80px" });
            }
        });

		function getScrollbarWidth() {
			var outer = document.createElement("div");
			outer.style.visibility = "hidden";
			outer.style.width = "100px";
			document.body.appendChild(outer);

			var widthNoScroll = outer.offsetWidth;
			// force scrollbars
			outer.style.overflow = "scroll";

			// add innerdiv
			var inner = document.createElement("div");
			inner.style.width = "100%";
			outer.appendChild(inner);

			var widthWithScroll = inner.offsetWidth;

			// remove divs
			outer.parentNode.removeChild(outer);

			return widthNoScroll - widthWithScroll;
		}
    </script>

    <!-- game -->
    <div id="game-page" class="popup-page-common scale">
        <div class="header-bar">
            <div class="left">
                <a>
                    <i class="icon sprites"></i>
                    <strong>Play Game</strong>
                </a>
            </div>
            <div class="right">
                <button class="btn-back-to-home sprites" onClick="clickClose_Page( '#game-page' );">Back</button>
            </div>
        </div>
        <div class="wrapper">
            <div class="game-end">
                <div class="background">
                    <strong>GAME END</strong>
                    <strong id="res-percent"></strong>
                    <ul class="result">
                        <!-- load ajax -->
                    </ul>
                </div>
                <div class="action">
                    <button class="btn-replay sprites" title="Play again">Replay</button>
                    <button class="btn-continue sprites" title="Continue">Continue</button>
                </div>
            </div>

            <!-- game writing -->
            <div class="game-play game-writing" style="display: none;">
                <div class="status-header"><span class="min">1</span> Of <span class="max">25</span></div>
                <div class="word">แสดงความยินดี</div>
                <div class="input">
                    <!-- load ajax -->
                </div>
                <div class="status-footer">
                    <div class="main">
                        <div class="time">TIME : <span>0.00</span></div>
                        <div class="skip" onclick="game.game_skip();"><a>Skip ></a></div>
                    </div>
                </div>
            </div>

            <!-- game speaking -->
            <div class="game-speaking" style="display: none;">
                <div class="status-header"><span class="min">1</span> Of <span class="max">25</span></div>
                <div class="word">แสดงความยินดี</div>
                <div class="main-outer">
                	<div class="main-inner">
                    	<i onClick="new GameSpeaking().startMic( event );" class="sprites icon-speaking"></i>
                        <div class="display">
                        	<i class="sprites icon-speak-now"></i>
                            <div class="message">
                            	<!--<div class="right"><span>concentrate</span> <i class="sprites"></i></div>-->
                                Speak now
                            </div>
                        </div>
                    </div>
                </div>
                <div class="status-footer">
                    <div class="main">
                        <div class="skip" onclick="gameSpeaking.skip();"><a>Skip ></a></div>
                    </div>
                </div>
            </div>

            <!-- game listening -->
            <div class="game-listening" style="display: none;">
                <div class="status-header"><span class="min">1</span> Of <span class="max">25</span></div>
                <div class="main-outer">
                	<div class="speaking-volume">
                    	<i class="icon-volume sprites" onClick="new GameListening().speak( 'congratulation' );"></i>
                    </div>
                    <div class="choice">
                    	<input onClick="gameListening.selected( this, false );" type="button" value="สวัสดี">
                        <input onClick="gameListening.selected( this, true );" type="button" value="แสดงความยินดี">
                        <input onClick="gameListening.selected( this, false );" type="button" value="โชคดี">
                        <input onClick="gameListening.selected( this, false );" type="button" value="ขอบคุณ">
                    </div>
                </div>
                <div class="status-footer">
                    <div class="main">
                        <div class="time">TIME : <span>0.00</span></div>
                        <div class="skip" onclick="gameListening.skip();"><a>Skip ></a></div>
                    </div>
                </div>
            </div>

            <div class="menu" style="display: block;">
            	<strong>Play Game</strong>
                <ul class="list-game">
                	<li onClick="play_game('speaking', this);" class="speaking"><i class="sprites icon"></i> <span>Speaking</span></li>
                    <li onClick="play_game('listening', this);" class="listening"><i class="sprites icon"></i> <span>Listening</span></li>
                    <li onClick="play_game('writing', this);" class="writing"><i class="sprites icon"></i> <span>Writing</span></li>
                </ul>
            </div>

            <div class="how-to-play" style="display: none;">
            	<div class="popup">
                	<div class="header">How To Play ?</div>
                    <div class="discript">Speaking English word of translation to clearly.</div>
                </div>
                <button class="btn-clickToPlay">Play</button>
                <script type="text/javascript">
                  $(document).ready(function(){
                    $('.btn-clickToPlay').click(function(){
                      $('.how-to-play').hide();
                    });
                  });
                </script>
            </div>
        </div>
    </div>

    <!-- chart -->
    <div id="chart-page" class="popup-page-common scale">
        <div class="header-bar">
            <div class="left">
                <a>
                    <i class="icon sprites"></i>
                    <strong>View Chart</strong>
                </a>
            </div>
            <div class="right">
                <button class="btn-back-to-home sprites" onClick="clickClose_Page( '#chart-page' );">Back</button>
            </div>
        </div>
        <div class="wrapper">
            <div class="main">
                <strong class="topic">ตรางการเพิ่มคำศัพท์</strong>
                <div id="dicplay-chart"></div>
            </div>
            <div class="bar-right">
                <ul id="select-view-chart">
                    <li class="active" onClick="click_view_chart(this, 'word_of_this_week')">This week</li>
                    <li onClick="click_view_chart(this, 'word_of_this_month')">This month</li>
                    <li onClick="click_view_chart(this, 'word_of_this_year')">This year</li>
                </ul>
            </div>
        </div>
    </div>
    <script type="text/javascript">
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(set_Chart);
    </script>

    <!-- popup display none -->
    <div id="popup_welcome" style="display: none;">
        <p><strong>Welcome</strong></p>
        <p>IamDict คือสมุดจดบันทึกคำศัพท์ภาษาอังกฤษ และเกมช่วยฝึกทักษะการพูด, ฟัง, เขียน ภาษาอังกฤษ</p>
        <!--<p>
            <div id="fb-root"></div>
            <script>(function(d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) return;
              js = d.createElement(s); js.id = id;
              js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&appId=428462407299795&version=v2.0";
              fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));</script>
            <div class="fb-like-box" data-href="https://www.facebook.com/iamdict" data-width="500" data-height="200" data-colorscheme="light" data-show-faces="true" data-header="false" data-stream="false" data-show-border="true"></div>
        </p>-->
    </div>
    </div>
    <div id="popup_help" style="display: none">
        <p><h3>Help วิธีใช้ ?</h3></p>
        <p>
        <ul class="list">
            <li><strong>- Add word เพิ่มคำศัพท์</strong>
                <ul>
                    <li>เพิ่มคำศัพท์ภาษาอังกฤษ (การแต่งประโยคจะช่วยเพิ่มความเข้าใจและจำได้ดีขึ้น)</li>
                </ul>
            </li>
        </ul>
        </p>
        <p>
        <ul class="list">
            <li><strong>- My Dictionary ดิกชันนารีของฉัน</strong>
                <ul>
                    <li>แสดงคำศัพท์ทั้งหมด a-z สามารถแก้ไขคำษัพท์ได้</li>
                </ul>
            </li>
        </ul>
        </p>
        <p>
        <ul class="list">
            <li><strong>- Play Game เกม</strong>
                <ul>
                    <li>Speaking เกมฝึกทักษะการพูดภาษาอังกฤษแบบชัดเจน</li>
                    <li>Listening เกมฝึกทักษะการฟังภาษาอังกฤษ</li>
                    <li>Writing เกมฝึกทักษะการจำคำศัพท์ภาษาอังกฤษ</li>
                </ul>
            </li>
        </ul>
        </p>
        <p>
        <ul class="list">
            <li><strong>- View Chart วิวชาร์ต</strong>
                <ul>
                    <li>แสดงประวัติการบันทึกคำศัพท์ภาษาอังกฤษ</li>
                </ul>
            </li>
        </ul>
        </p>
    </div>
    <div id="popup_about" style="display: none">
        <p><h3>About เกี่ยวกับ ?</h3></p>
        <p>IamDict คือสมุดจดบันทึกคำศัพท์ภาษาอังกฤษ และเกมช่วยฝึกทักษะการพูด, ฟัง, เขียน ภาษาอังกฤษ</p>
        <p>จุดประสงค์ของ IamDict คือ ต้องการช่วยให้เราจำคำศัพท์ภาษาอังกฤษได้มากขึ้น โดยการเพิ่มคำศัพท์ด้วยตนเองและเล่นเกมเพื่อทบทวนคำษัพท์เหล่านั้น</p>
        <p>เว็บแอพพลิเคชั่นเพื่อการศึกษา เปิดให้บริการสำหรับนักเรียน นักศึกษาที่ต้องการพัฒนาทักษะด้านภาษาอังกฤษ</p>
        <!--<p>พัฒนาโดย นักศึกษา <a href="http://spu.ac.th" target="_blank">มหาวิทยาลัยศรีปทุม</a> <a href="https://twitter.com/_CHAI__" target="_blank">อภิชัย เด่นสมุทร</a></p>-->
    </div>
    <div id="popup_forgetPassword" style="display: none;">
        <input type="text" class="style-input email" placeholder="Enter your email"> <input type="submit" value="send" onClick="forgetPass();">
        <p class="responsive_msg"></p>
        <script type="text/javascript">
            function clear_forgetPass() {
                $('p.responsive_msg').html("").hide();
                $('#popup_forgetPassword .email').val("");
                setTimeout(function(){
                    $('#popup_forgetPassword .email').focus();
                },500);
            }
            function forgetPass() {
                var email = $('#popup_forgetPassword .email');
                var show_msg = $('p.responsive_msg');

                show_msg.hide();

                if( email.val().search(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/) != 0 )
                {
                    // fail
                    show_msg.html('<span style="color:red;">Check your email !</span>');
                    show_msg.show();
                    email.focus();
                }
                else
                {
                    $.ajax({
                        type: 'POST',
                        url: 'api.php?access=sendEmail',
                        data: { email: email.val() },
                        success: function( res ) {

                            if( res == "success" )
                            {
                                show_msg.html('send your password to email: ' + '<u>' + email.val() + '</u><br /> please check in your Mail box or junk Mail.');
                                show_msg.show();
                                email.val("");
                            }
                            else
                            {
                                show_msg.html( '<span style="color: red;">Not found <br />This email : <u>' + email.val() + "</u> doesn't have register.</span>" );
                                show_msg.show();
                            }
                        }
                    });
                }
            }
        </script>
    </div>

</body>
</html>
