class Home {
    constructor() {
        this.tar = new Date('2022/6/1 16:00:00');
        this.countDown();
        this.timer = setInterval(this.countDown, 1000);

        this.current = 1;
        this.carousel();
        this.flag = true;
        this.$('.cycle1').addEventListener('click', this.changeBtn.bind(this));
        this.dw = 0;        
        this.timer;
        this.lock = false;
        this.autoData();
        
        this.aBox = this.$('.cycle2 .aa');
        this.fadeEve();
        //登录后显示个人信息
        this.userInfo();
        //退出登录
        this.$('.logBox .logout').addEventListener('click', this.loginOut.bind(this));
        this.backTop();
        this.carNum();
    }

    fadeEve() {
        this.fade();
        this.$('.slide1').addEventListener('click', this.fadeBtn.bind(this));
    }

    //回到顶部
    backTop() {
        this.$('.tbar-tab-top').onclick = function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }
    }

    //获取购物车商品数量
    async carNum() {
        let uId = localStorage.getItem('user_id');
        let { status, data } = await axios.get('http://localhost:8888/cart/list?id=' + uId);
        if (status == 200) {
            if (data.code == 401) {
                location.assign('login.html?returnUrl=home.html');
                return;
            }
            if (data.code == 1) {
                // console.log(data.cart.length)
                this.$('.tab-sub').innerHTML = data.cart.length;
                this.$('.shopnum').innerHTML = data.cart.length;
            }
        }
    }
    //登录后显示个人信息
    async userInfo() {
        let token = localStorage.getItem('token');
        let uId = localStorage.getItem('user_id');
        axios.defaults.headers.common['Authorization'] = token;
        if (!token || !uId) return;
        let { status, data } = await axios.get('http://localhost:8888/users/info?id=' + uId);
        console.log(data);
        if (status == 200 && data.code == 1) {
            this.$('.loge1').style.display = 'none';
            this.$('.loge2 .loge3').innerHTML = data.info.username;
            this.$('.loge2').style.display = 'block';
        }
        if (status == 200 && data.code == 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            location.assign('login.html?returnUrl=home.html');
        }
    }

    //退出登录
    async loginOut() {
        let token = localStorage.getItem('token');
        let uId = localStorage.getItem('user_id');
        axios.defaults.headers.common['Authorization'] = token;
        if (!token || !uId) return;
        let { status, data } = await axios.get('http://localhost:8888/users/logout?id=' + uId);
        if (status == 200 && data.code == 1) {
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            location.reload();
        }
    }

    //淡入淡出轮播图
    static lastIndex = 0;
    static index = 0;
    fade() {
        let divs = this.$('.carFa > .item');
        setInterval(() => {
            Home.lastIndex = Home.index;
            Home.index++;
            if (Home.index > divs.length - 1) {
                Home.index = 0;
            }

            this.change();
        }, 2000)
    }

    change = () => {
        let divs = this.$('.carFa > .item');
        divs[Home.lastIndex].classList.remove('active');
        divs[Home.index].classList.add('active');
    }

    //按钮操作
    fadeBtn({ target }) {
        let divs = this.$('.carFa > .item');
        if (target.classList.contains('pre')) {
            Home.lastIndex = Home.index;
            Home.index--;
            if (Home.index < 0) {
                Home.index = divs.length - 1;
            }

            this.change();
        }
        if (target.classList.contains('nex')) {
            Home.lastIndex = Home.index;
            Home.index++;
            if (Home.index > divs.length - 1) {
                Home.index = 0;
            }
            this.change();
        }
    }

    //倒计时
    countDown = () => {
        let date = new Date();
        let res = this.dTime(this.tar, date);
        if (res.h < 10) {
            this.$('.hour b').innerHTML = `0${res.h}`;
        } else if (res.h >= 10) {
            this.$('.hour b').innerHTML = res.h;
        }

        if (res.m < 10) {
            this.$('.minute b').innerHTML = `0${res.m}`;
        } else if (res.m >= 10) {
            this.$('.minute b').innerHTML = res.m;
        }

        if (res.s < 10) {
            this.$('.second b').innerHTML = `0${res.s}`;
        } else if (res.s >= 10) {
            this.$('.second b').innerHTML = res.s;
        }

        if (res.h == 0 && res.m == 0 && res.s == 0) {
            clearInterval(this.timer);
        }
    }
    dTime(t1, t2) {
        let obj = {};
        let time = Math.ceil(Math.abs(t1 - t2) / 1000);
        let h = parseInt(time % (60 * 60 * 24) / (60 * 60));
        let m = parseInt(time % (60 * 60) / 60);
        let s = time % 60;
        obj.h = h;
        obj.m = m;
        obj.s = s;
        return obj;
    }

    //轮播图换页
    async carousel() {
        let pageSize = 40;
        let par4 = `current=1&pagesize=${pageSize}`;
        let { status, data } = await axios.get('http://localhost:8888/goods/list?' + par4);
        if (status != 200 || data.code != 1) throw new Error('数据获取失败');
        let innerDiv;
        for (let i = 4; i <= pageSize; i += 4) {
            let list1 = data.list.splice(0, 4);
            // console.log(list1);
            innerDiv = document.createElement('div');
            let html = '';
            list1.forEach(ele => {
                html += `                    
                        <a href="list.html">
                            <li class="yui3-u-5-24 product">
                                <img src="${ele.img_big_logo}">
                                <p>${ele.title}</p>
                                <span class="price2"><i>￥</i><b>${ele.current_price}</b></span>
                            </li>
                        </a>
                    `

            });
            innerDiv.innerHTML = html;
            this.$('.imgBox').appendChild(innerDiv);
        }

        this.dw = this.$('.cycle1').clientWidth;
        this.copyEle();
    }
    copyEle = () => {
        let div1 = this.$('.imgBox');
        const first = this.$('.imgBox').firstElementChild.cloneNode(true);
        const last = this.$('.imgBox').lastElementChild.cloneNode(true);
        // 1-2. 把复制好的元素插入到 div 内
        div1.appendChild(first);
        div1.insertBefore(last, this.$('.imgBox').firstElementChild);
        // 1-3. 从新调整宽度
        // div 内所有子元素的数量 * 100 + '%'
        div1.style.width = div1.children.length * 100 + '%';

        // 1-4. 调整 div 的位置
        div1.style.left = -this.dw * this.current + 'px';
    }

    //运动结束
    moveEnd = () => {
        let div2 = this.$('.cycle1 .imgBox');
        // 4-1. 判断如果是 假的第一张
        if (this.current == div2.children.length - 1) {
            // 瞬间定位到真的第一张
            this.current = 1;
            div2.style.left = -this.dw * this.current + 'px';
        }

        // 4-2. 判断如果是 假的最后一张
        if (this.current == 0) {
            // 瞬间定位的真的最后一张
            this.current = div2.children.length - 2;
            div2.style.left = -this.dw * this.current + 'px';
        }

        // 所有运动结束了
        this.flag = true
    }

    changeBtn({ target }) {
        if (target.nodeName == 'BUTTON' || target.classList.contains('prev1')) {
            if (!this.flag) return;
            this.flag = false;
            this.current--;
            move(this.$('.cycle1 > div'), { left: - this.dw * this.current }, this.moveEnd);
        }
        if (target.nodeName == 'BUTTON' || target.classList.contains('next1')) {
            if (!this.flag) return
            this.flag = false
            this.current++;
            move(this.$('.cycle1 .imgBox'), { left: -this.dw * this.current }, this.moveEnd);

        }
    }

    //自动轮播
    static num = 0;
    static cw = 0;
    async autoData() {
        let par5 = `current=2&pagesize=40`;
        let { status, data } = await axios.get('http://localhost:8888/goods/list?' + par5);
        if (!status || data.code != 1) {
            layer.msg('数据获取失败');
            return;
        }
        let list3 = data.list.slice(25, 27);
        // console.log(list3);
        let html2 = '';
        list3.forEach(ele => {
            html2 += `
                <a href="list.html" class="imga">
                    <li class="yui3-u-5-24 product">
                        <img src="${ele.img_big_logo}">
                        <i>品优购品牌秒杀</i>
                        <p>品优购品牌秒杀</p>                        
                        <b class="kill">品牌秒杀</b>
                    </li>
                </a>
            `
        })
        this.$('.cycle2 .imgBox2').innerHTML = html2;
        Home.cw = this.$('.cycle2').clientWidth;
        
        this.autoCopy();
        Home.imgArr = document.querySelectorAll('.imga');
        this.autoPlay();
    }
    static aI = document.querySelectorAll('.org');
    autoCopy(){
        let div1 = document.querySelector('.imgBox2');       
        const first = div1.firstElementChild.cloneNode(true);
        const last = div1.lastElementChild.cloneNode(true);
        // 1-2. 把复制好的元素插入到 div 内
        div1.appendChild(first);
        div1.insertBefore(last, div1.firstElementChild);
        // 1-3. 从新调整宽度
        // div 内所有子元素的数量 * 100 + '%'
        div1.style.width = div1.children.length * 100 + '%';

        // 1-4. 调整 div 的位置
        div1.style.left = -Home.cw * Home.num + 'px';
        Home.aI[Home.num].style.backgroundColor = 'red';
    }
    
   /*  static imgArr;
    static imgList = document.querySelector('.imgBox2'); */

    /* static setA(){
        if(Home.num >= Home.imgArr.length){  //Home.imgArr.length - 1
            //则将index设置为0
            Home.num = 0;
            
            //此时显示的最后一张图片，而最后一张图片和第一张是一摸一样
            //通过CSS将最后一张切换成第一张
            Home.imgList.style.left = -Home.cw * Home.num + 'px';
        }
        
        //遍历所有a，并将它们的背景颜色设置为红色
        for(let i = 0 ; i < Home.aI.length; i++){
            Home.aI[i].style.backgroundColor = "";
        }
        //将选中的a设置为黑色
        Home.aI[Home.num].style.backgroundColor = "red";
    } */    
     /* autoPlay(){
        setInterval(()=>{       
            Home.num++;                 
            if(Home.num == Home.imgArr.length) Home.num = 0;          
            move1(Home.imgList , "left" , -Home.cw * Home.num , 20 , function(){
                //修改导航按钮
                Home.setA();
            });
            console.log(-Home.cw * Home.num)
        },2000)
    }  */
 


    //焦点跟随    
   
    $(ele) {
        let res = document.querySelectorAll(ele);
        return res.length == 1 ? res[0] : res;
    }
}
new Home;