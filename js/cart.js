class Cart {
    constructor() {
        this.loginCart();
        this.cartList();
        this.$('.cList').addEventListener('click', this.changeBtn.bind(this));
        this.$('.cAll').addEventListener('click', this.checkAll.bind(this));
        this.$('.cAll2').addEventListener('click', this.checkAll2.bind(this));
        this.$('.delChecked').addEventListener('click', this.delCheck.bind(this));
        this.$('.sum-btn').addEventListener('click', this.Pay.bind(this));
        this.clearEve();
    }

    //支付
    async Pay() {
        let token = localStorage.getItem('token');
        let uId = localStorage.getItem('user_id');
        axios.defaults.headers.common['Authorization'] = token;
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        let res = Array.from(this.$('.goods-list1 .gbox')).find(input => {
            return !!input.checked;
        })
        if (!res) return;
        let par7 = `id=${uId}`
        let { status, data } = await axios.post('http://localhost:8888/cart/pay', par7);
        // console.log(status);
        console.log(data)
        if (status == 200) {
            if (data.code == 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                location.assign('login.html?returnUrl=cart.html');
            } else if (data.code == 1) {
                location.assign('pay.html');
            }
        }
    }
    //清空购物车操作集合
    clearEve() {
        this.$('.clear').onclick = () => {
            this.$('.popup').style.display = 'block';
        }
        this.$('.cross').onclick = () => {
            this.$('.popup').style.display = 'none';
        }
        this.$('.popup').addEventListener('click', this.getWin.bind(this));
    }

    //获取弹窗里的数据
    getWin({ target }) {
        let tick;
        if (target.classList.contains('imgInfo')) {
            tick = target.querySelector('.tick');
        }
        if (target.classList.contains('img3')) {
            tick = target.nextElementSibling;
        }
        if ($(tick).css('display') == 'none') {
            $(tick).css('display', 'block');
            let ps = this.$('.tick');
            let res = Array.from(ps).find(p => {
                return $(p).css('display') == 'none';
            })
            if (res) this.$('.gAll').checked = false;
            if (!res) this.$('.gAll').checked = true;
        } else {
            $(tick).css('display', 'none');
            if ($(tick).css('display') == 'none') {
                this.$('.gAll').checked = false;
            }
        }
        if (target.nodeName == 'INPUT' && target.classList.contains('delete')) {
            this.clearCart();
        }
        if (target.nodeName == 'INPUT' && target.classList.contains('gAll')) {
            tick = this.$('.tick');
            if (target.checked) {
                $(tick).css('display', 'block');
            } else {
                $(tick).css('display', 'none');
            }
        }



    }
    //清空购物车
    async clearCart() {
        let token = localStorage.getItem('token');
        let uId = localStorage.getItem('user_id');
        axios.defaults.headers.common['Authorization'] = token;
        if (!token || !uId) location.assign('login.html?returnUrl=cart.html');

        if (this.$('.gAll').checked) {
            let para = `id=${uId}`;
            let { status, data } = await axios.get('http://localhost:8888/cart/clear?' + para);
            let uls = document.querySelectorAll('.goods-list1');
            let lis = document.querySelectorAll('.img2 > li');
            if (status == 200) {
                if (data.code == 1) {
                    lis.forEach(li => {
                        layer.msg('删除成功');
                        li.remove();
                        this.$('.popup').style.display = 'none';
                        this.cartList();
                    })

                }
            }
        } else {
            let lis = document.querySelectorAll('.imgInfo');
            let arr = [];
            lis.forEach(async li => {
                let tick = li.querySelector('.tick');
                if ($(tick).css('display') == 'block') {
                    arr.push(li);
                }

            })
            if (arr) {
                arr.forEach(async li => {
                    let goodsId = li.dataset.id;
                    let par3 = `id=${uId}&goodsId=${goodsId}`;
                    let { status, data } = await axios.get('http://localhost:8888/cart/remove?' + par3);
                    if (status == 200) {
                        if (data.code == 1) {
                            console.log(data);
                            layer.msg('删除成功');
                            li.remove();
                            this.cartList();
                        }
                    }
                })
            }

        }
    }


    //先获取用户信息,看看有没有获取到list页面传过来的数据,传过来再获取购物车列表
    async loginCart() {
        let uId = localStorage.getItem('user_id');
        let token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = token;
        let { status, data } = await axios.get('http://localhost:8888/users/info?id=' + uId);
        if (!token || data.code == 401) {
            location.assign('login.html?returnUrl=cart.html');
        }
    }

    async cartList() {
        let uId = localStorage.getItem('user_id');
        let { status, data } = await axios.get('http://localhost:8888/cart/list?id=' + uId);
        if (status == 200) {
            if (data.code == 401) {
                location.assign('login.html?returnUrl=cart.html');
                return;
            }
            if (data.code == 1) {
                // console.log(data);
                let html = '';
                let html2 = '';
                data.cart.forEach(ele => {
                    html += `
                    <ul class="goods-list goods-list1 active yui3-g" data-id="${ele.goods_id}">
                        <li class="yui3-u-3-8 pr">
                            <input type="checkbox" class="good-checkbox gbox">
                            <div class="good-item">
                                <div class="item-img">
                                    <img src="${ele.img_small_logo}">
                                </div>
                                <div class="item-msg">${ele.title}</div>
                            </div>
                        </li>
                        <li class="yui3-u-1-8">
                            <span>颜色: 银色</span>
                            <br>
                            <span>处理器: Core I5</span>
                            <br>
                            <span>内存: 8GB</span>
                            <br>
                            <span>尺寸: 13.3英寸</span>
                            <br>
                        </li>
                        <li class="yui3-u-1-8">
                            <span class="price cPrice">${ele.current_price}</span>
                            原价<span class="price2">${ele.price}</span>
                        </li>
                        <li class="yui3-u-1-8">
                            <div class="clearfix">
                                <a href="#none" class="increment mins mins1">-</a>
                                <input autocomplete="off" type="text" value="${ele.cart_number}" minnum="1" class="itxt itxt1">
                                <a href="#none" class="increment plus plus1">+</a>
                            </div>
                            <div class="youhuo">有货</div>
                        </li>
                        <li class="yui3-u-1-8">
                            <span class="sum sum2">${ele.cart_number * ele.current_price}</span>
                        </li>
                        <li class="yui3-u-1-8">
                            <div>
                                <a href="#none" class="del">删除</a>
                            </div>
                            <div>移到我的关注</div>
                        </li>
                    </ul>               
                    `;

                    html2 += `
                        <li class="imgInfo" data-id="${ele.goods_id}">
                            <img src="${ele.img_small_logo}" class="img3">
                            <p class="tick"></p>
                        </li>
                      `;
                })
                this.$('.cList').innerHTML = html;
                this.$('.popup .img2').innerHTML = html2;
            }
        }
    }
    changeBtn({ target }) {
        if (target.nodeName == 'A' && target.classList.contains('del')) {
            this.delData(target);
        }
        if (target.nodeName == 'INPUT' && target.classList.contains('gbox')) {
            this.checkSin(target);
            this.sumData();
        }
        console.log(this);
        this.changeNum(target);
    }

    delData(target) {
        let conDel = layer.confirm('确认删除吗?', {
            title: '删除确认'
        }
            , async function () {
                let uId = localStorage.getItem('user_id');
                let ul = target.parentNode.parentNode.parentNode;
                let goodsId = ul.dataset.id;
                let par3 = `id=${uId}&goodsId=${goodsId}`;
                let { status, data } = await axios.get('http://localhost:8888/cart/remove?' + par3);
                if (status == 200) {
                    if (data.code == 1) {
                        layer.close(conDel);
                        ul.remove();
                        layer.msg('商品删除成功');
                    }

                }
            }
        )
    }

    //计算商品总数量和总价格
    sumData = () => {
        let goods = document.querySelectorAll('.gbox');
        let num = 0;
        let sumPrice = 0;
        let sumPrice2 = 0;
        let differ = 0;
        goods.forEach(ele => {
            if (ele.checked) {
                let ul = ele.parentNode.parentNode;
                let totalNum = ul.querySelector('.itxt1').value - 0;
                let totalPrice = totalNum * ul.querySelector('.cPrice').innerHTML - 0;
                let totalPrice2 = totalNum * ul.querySelector('.price2').innerHTML - 0;
                num += totalNum;
                sumPrice += totalPrice;
                sumPrice2 += totalPrice2;
                differ += sumPrice2 - sumPrice;
                this.$('.goods-list .sum2').innerHTML = parseInt(sumPrice * 100) / 100;
            }
        })
        let sumP = parseInt(sumPrice * 100) / 100;
        this.$('.sumprice-top strong').innerHTML = num;
        this.$('.sumprice-top .summoney').innerHTML = `￥${sumP}`;
        this.$('.sumprice-bottom').innerHTML = '已节省：￥' + parseInt(differ * 100) / 100;
    }

    //改变数量
    async changeNum(target) {
        let ul = target.parentNode.parentNode.parentNode;
        let num = ul.querySelector('.itxt1');
        let numVal = num.value;
        let price = ul.querySelector('.cPrice').innerHTML - 0;
        if (target.nodeName == 'A' && target.classList.contains('mins1')) {
            numVal--;
        }
        if (target.nodeName == 'A' && target.classList.contains('plus1')) {
            numVal++;
        }
        let token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = token;
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        let id = localStorage.getItem('user_id');
        let goodsId = ul.dataset.id;
        let par4 = `id=${id}&goodsId=${goodsId}&number=${numVal}`;
        let { status, data } = await axios.post('http://localhost:8888/cart/number', par4);
        if (status == 200) {
            if (!token || data.code == 401) {
                location.assign('login.html?returnUrl=cart.html');
            }
            if (data.code == 1) {
                num.value = numVal;
            }
            this.$('.sum2').innerHTML = parseInt(numVal * price * 100) / 100;
            this.sumData();
        }

    }

    //全选
    checkAll() {
        let cAll = document.querySelector('.cAll');
        let gbox = document.querySelectorAll('.gbox');
        gbox.forEach(input => {
            input.checked = cAll.checked;
        })
        this.sumData();
    }

    checkAll2() {
        let gbox = document.querySelectorAll('.gbox');
        gbox.forEach(input => {
            input.checked = true;
        })
        this.$('.cAll').checked = true;
        this.sumData();
    }

    delCheck() {
        let gbox = document.querySelectorAll('.gbox');
        let arr = [];
        gbox.forEach(input => {
            if (input.checked) {
                arr.push(input);
            }
        })
        if (arr) {
            let conDel = layer.confirm('确认删除吗?', {
                title: '删除确认'
            }, function () {
                arr.forEach(async ele => {
                    let uId = localStorage.getItem('user_id');
                    let ul = ele.parentNode.parentNode;
                    let goodsId = ul.dataset.id;
                    let par3 = `id=${uId}&goodsId=${goodsId}`;
                    let { status, data } = await axios.get('http://localhost:8888/cart/remove?' + par3);
                    if (status == 200) {
                        if (data.code == 1) {
                            layer.close(conDel);
                            layer.msg('商品删除成功');
                            ul.remove();

                        }

                    }
                })
                document.querySelector('.cAll').checked = false;
            }
            )
        }
    }

    //根据单个选框来判断全选是否应该选中
    checkSin(target) {
        let cAll = document.querySelector('.cAll');
        let gbox = document.querySelectorAll('.gbox');
        if (!target.checked) {
            cAll.checked = false;
        }
        if (target.checked) {
            let res = Array.from(gbox).find(input => {
                return !input.checked;
            })
            if (!res) cAll.checked = true;
        }

    }

    $(ele) {
        let res = document.querySelectorAll(ele);
        return res.length == 1 ? res[0] : res;
    }
}
new Cart;