class Cart {
    constructor() {
        this.loginCart();
        this.cartList();
        this.$('.cList').addEventListener('click', this.changeBtn.bind(this));
        this.$('.cAll').addEventListener('click', this.checkAll.bind(this));
        this.$('.cAll2').addEventListener('click', this.checkAll2.bind(this));
        this.$('.delChecked').addEventListener('click', this.delCheck.bind(this));
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
                let html = '';
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
                })
                this.$('.cList').innerHTML = html;
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
            }
        })

        this.$('.sumprice-top strong').innerHTML = num;
        this.$('.sumprice-top .summoney').innerHTML = parseInt(sumPrice * 100) / 100;
        this.$('.sumprice-bottom').innerHTML = '已节省：￥' + parseInt(differ * 100) / 100;
    }

    //改变数量
    async changeNum(target) {
        let ul = target.parentNode.parentNode.parentNode;
        let num = ul.querySelector('.itxt1');
        let numVal = num.value;
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
            } ,  function () {
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