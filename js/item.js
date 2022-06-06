class Item {
    constructor() {        
        this.getData();        
        this.goodsId = location.search.split('=')[1];
        
        this.$('.addshopcar').addEventListener('click', this.addCart.bind(this, this.goodsId));
        
        this.$('.unstyled2').addEventListener('click',this.addEve.bind(this));
        
    }
    //分类去商品加入购物车
    addEve({target}){
        if(target.classList.contains('btn-bordered') || target.classList.contains('operate')){
            let li = target.parentNode.parentNode;
            let goodsId = li.dataset.id;
            this.addCart(goodsId);
        }
    }
    async localData() {
        let cate = localStorage.getItem('category')
        if (cate) {
            let { status, data } = await axios.get('http://localhost:8888/goods/list?current=1&pagesize=922');
            if (status == 200) {
                if(data.code == 1){
                    let html= '';
                    console.log(data);
                    let num = 0;
                data.list.forEach((v,k)=>{
                    if(num > 5) return;
                    if(v.category == cate){
                        num++;
                        html += `
                                <li data-id=${v.goods_id}>
                                    <div class="p-img"><img src="${v.img_big_logo}"></div>
                                    <div class="attr"><em>${v.title}</em></div>
                                    <div class="price"><strong>￥${v.current_price}</strong></div>
                                    <div class="operate"><a href="#none" class="sui-btn btn-bordered">加入购物车</a></div>
                                </li>
                        `
                    }
                    this.$('.unstyled2').innerHTML = html;
                })
                }
            }
        }
    }

    async getData() {
        let token = localStorage.getItem('token');
        let uId = localStorage.getItem('user_id');
        axios.defaults.headers.common['Authorization'] = token;
        let gid = location.search.split('=')[1];
        let { status, data } = await axios.get('http://localhost:8888/goods/item?id=' + gid);
        localStorage.setItem('category', data.info.category);
        if (status == 200) {
            if (!token || data.code == 401) {
                location.assign('login.html?returnUrl=item.html');
            } else if (data.code == 1) {
                // console.log(data);
                let html = `
                 <img class="xzoom" xoriginal="uploads/b1.png" src="${data.info.img_big_logo}" width="100%">
                 <span class="zz"></span>
               `
                let html2 = `
                <h4>${data.info.title}</h4>
              `
                let html3 = `${data.info.current_price}`;
                let html4 = `${data.info.goods_introduce}`;
                let html5 = `
                    <a href="${data.info.img_big_logo}"><img class="xzoom-gallery" src="${data.info.img_big_logo}" width="60"></a>
                    <a href="${data.info.img_big_logo}"><img class="xzoom-gallery" src="${data.info.img_big_logo}" width="60"></a>
                    <a href="${data.info.img_big_logo}"><img class="xzoom-gallery" src="${data.info.img_big_logo}" width="60"></a>
                    <a href="${data.info.img_big_logo}"><img class="xzoom-gallery" src="${data.info.img_big_logo}" width="60"></a>
                    <a href="${data.info.img_big_logo}"><img class="xzoom-gallery" src="${data.info.img_big_logo}" width="60"></a>
                    <span class="prev"><</span>
                    <span class="next">></span>
              `
                let html6 = `<img src="${data.info.img_big_logo}" class="bigImg">`;
                // let str = "//";
                this.$('.spec-preview').innerHTML = html;
                this.$('.sku-name').innerHTML = html2;
                this.$('.price2 em').innerHTML = html3;
                this.$('.intro-detail').innerHTML = html4.replace(/https:/g, "").replace(/http:/g, "").replace(/\/\//g, "https://");
                this.$('.spec-scroll').innerHTML = html5;
                this.$('.big').innerHTML = html6;
            }
        }
        this.zoom();
        this.localData();
    }
    //放大镜效果
    zoom() {
        this.$('.spec-preview').onmouseover = () => {
            this.$('.zz').style.display = 'block';
            this.$('.big').style.display = 'block';
        }
        this.$('.spec-preview').onmousemove = (event) => {
            let zz = document.querySelector('.zz');
            let smallDiv = document.querySelector('.spec-preview');
            let bigDiv = document.querySelector('.big');
            let bigImg = document.querySelector('.bigImg');
            event = event || window.event;
            let x = event.pageX - zz.offsetWidth / 2 - smallDiv.offsetLeft;
            let y = event.pageY - zz.offsetHeight / 2 - smallDiv.offsetTop;
            if (x < 0) x = 0;
            if (y < 0) y = 0;
            let maxL = smallDiv.offsetWidth - zz.offsetWidth;
            let maxT = smallDiv.offsetHeight - zz.offsetHeight;
            if (x > maxL) x = maxL - 1;
            if (y > maxT) y = maxT - 1;
            // 第二个比例,bigDiv的宽高/zz的宽高,这个比例用于bigImg移动时用
            let r1 = bigDiv.offsetWidth / zz.offsetWidth;
            let r2 = bigDiv.offsetHeight / zz.offsetHeight;

            zz.style.left = x + 'px';
            zz.style.top = y + 'px';

            bigImg.style.left = -r1 * x + 'px';
            bigImg.style.top = -r2 * y + 'px';
        }
        this.$('.spec-preview').onmouseout = () => {
            this.$('.zz').style.display = 'none';
            this.$('.big').style.display = 'none';
        }
    }
    //加入购物车
    async addCart(Id) {
        let token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = token;
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        let id = localStorage.getItem('user_id');        
        let par = `id=${id}&goodsId=${Id}`;
        let { status, data } = await axios.post('http://localhost:8888/cart/add', par);
        // console.log(data);
        if (!token || status == 200) {
            if (data.code == 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                location.assign('login.html?returnUrl=item.html');
            } else if (data.code == 1) {
                layer.open({
                    title: '加入购物车确认'
                    , content: '确定加入购物车吗 ?'
                    , btn: ['确定', '留下']
                    , btn1: function () {
                        location.assign('cart.html');
                    }
                });
            } else {
                layer.msg({
                    title: '加入购物车失败'
                    , content: '请重新添加'
                    , time: 2000
                });
            }
        }
    }

    //
    // async getCategory() {
    //     let { status, data } = await axios.get('http://localhost:8888/goods/category');
    //     if (status == 200) {
    //         if (data.code == 1) {
    //             // console.log(data)
    //             let ul2 = this.$('.unstyled2');
    //            /*  let html = '';
    //             data.list */
    //         }
    //     }
    // }

    $(ele) {
        let res = document.querySelectorAll(ele);
        return res.length == 1 ? res[0] : res;
    }
}
new Item;