class List {
    constructor() {
        this.getData();
        window.addEventListener('scroll', this.lazyLoad);
        this.$('.product').addEventListener('click', this.checkLogin.bind(this));
        this.flag = false;
        this.current = 1;

    }

    async getData(page = 1) {
        let { status, data } = await axios.get('http://localhost:8888/goods/list?current=' + page);
        if (status != 200 || data.code != 1) throw new Error('数据获取失败');
        let html = '';

        data.list.forEach(v => {
            html += `
                <li class="yui3-u-1-5" data-id="${v.goods_id}">
                    <div class="p-img">
                        <a href="item.html"><img src="${v.img_big_logo}"></a>
                    </div>
                    <div class="attr"><em>${v.title}</em></div>
                    <div class="price"><strong><em>¥</em><i>${v.current_price}</i></strong><s>￥${v.price}</s></div>
                    <div class="sold"><span>已售${v.sale_type}</span><img src="./uploads/state_07.png" alt=""><span>剩余${v.goods_number}件</span></div>
                    <div class="operate">
                        <a href="#none" class="buy">立即抢购</a>
                    </div>
                </li>
           `
        });
        // console.log(html);   
        this.$('.goods-list ul').innerHTML += html;
    }
    checkLogin({ target }) {
        if (target.nodeName != 'A' || target.className != 'buy') return;
        let token = localStorage.getItem('token');
        if (!token) {
            location.assign('login.html?returnUrl=list.html');
            return;
        }
        let uId = localStorage.getItem('user_id');
        let goodsId = target.parentNode.parentNode.dataset.id;
        this.addCart(uId, goodsId);

    }

    async addCart(id, goodsId) {       
        let token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = token;
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        let par = `id=${id}&goodsId=${goodsId}`;
        let { status, data } = await axios.post('http://localhost:8888/cart/add', par);
        if (status == 200) {
            if (data.code == 401){
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                location.assign('login.html?returnUrl=list.html');
            }else if (data.code == 1) {
                layer.open({
                    title: '加入购物车确认'
                    ,content: '确定加入购物车吗 ?'
                    ,btn:['确定','留下']
                    ,btn1:function(){
                        location.assign('cart.html');
                    }
                  });
            }else{
                layer.msg({
                    title: '加入购物车失败'       
                    ,content:'请重新添加' 
                    ,time:2000        
                  });
            }
        }
    }


    lazyLoad = () => {
        let dt = document.body.scrollTop || document.documentElement.scrollTop;
        let dh = document.documentElement.clientHeight;
        let ul = document.querySelector('.goods-list ul');
        let uh = ul.offsetHeight + ul.offsetTop;
        if (uh > (dt + dh)) return;
        if (this.flag) return;
        this.flag = true;
        setTimeout(() => {
            this.current++;
            this.getData(this.current);
            this.flag = false;
        }, 400)

    }

    $(ele) {
        let res = document.querySelectorAll(ele);
        return res.length == 1 ? res[0] : res;
    }
}
new List;