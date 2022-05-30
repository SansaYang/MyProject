class User {
    constructor() {
        this.userData();
        this.$('.sui-btn').addEventListener('click', this.upDate.bind(this));        
    }
    //获取信息
    async userData() {
        let token = localStorage.getItem('token');
        let uId = localStorage.getItem('user_id');
        axios.defaults.headers.common['Authorization'] = token;
        if (!token || !uId) return;
        let { status, data } = await axios.get('http://localhost:8888/users/info?id=' + uId);
        if (status == 200) {
            if (data.code == 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                location.assign('login.html?returnUrl=user.html');
            } else if (data.code == 1) {
                let name = data.info.username;
                let age = data.info.age;
                let gender = data.info.gender;
                let nick = data.info.nickname;
                this.$('.user').value = name;
                this.$('.age').value = age;
                this.$('.gender').value = gender;
                this.$('.nick').value = nick;
            }
        }

    }

    async upDate() {
        let token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = token;
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        let name = this.$('.user').value.trim();
        let uNreg = /^[a-z]{5,24}$/;
        let age = this.$('.age').value.trim();
        let ageReg = /^[0-9]{2,3}$/;
        let gender = this.$('.gender').value.trim();
        let genReg = /^[\u4e00-\u9fa5]{1}$/;
        let nick = this.$('.nick').value.trim();
        if (!name) {
            this.$('.userBox .warn').innerHTML = '用户名不能为空';
            return;
        }
        if (!uNreg.test(name)) {
            this.$('.userBox .warn').innerHTML = '用户名只能是5-24位的小写字母';
            return;
        };
        if (name && uNreg.test(name)) this.$('.userBox .warn').innerHTML = '';
        if (!gender) {
            this.$('.pwdBox .warn').innerHTML = '性别不能为空';
            return;
        }
        if (!genReg.test(gender)) {
            this.$('.pwdBox .warn').innerHTML = '性别必须是单个汉字';
            return;
        }
        if (gender && genReg.test(gender)) this.$('.pwdBox .warn').innerHTML = '';
        if (!age) {
            this.$('.firmPwd .warn').innerHTML = '年龄不能为空';
            return;
        }
        if (!ageReg.test(age)) {
            this.$('.firmPwd .warn').innerHTML = '年龄必须是2~3位数字';
            return;
        }
        if (gender && genReg.test(gender)) this.$('.firmPwd .warn').innerHTML = '';
        if (!this.$('.deal').checked) throw new Error('请勾选协议');
        let par5 = `username=${name}&age=${age}&gender=${gender}&nickname=${nick}`;
        let { status, data } = await axios.post('http://localhost:8888/users/update' + par5);
        if (status == 200 && data.code == 1) {
            layer.msg('修改成功');
            setTimeout(function () {
                if (location.search) {
                    location.assign(location.search.split('=')[1]);
                } else {
                    location.assign('home.html');
                }
            }, 1000)
        } else if (data.code == 0) {
            document.querySelector('.userBox .warn').innerHTML = data.message;
        }
    }

    /*    async register() {
           let uN = this.$('.user').value.trim();
           let uNreg = /^[a-z]{5,24}$/;
           let pwd = this.$('.pwd').value.trim();
           let pwdReg = /^\w{6,12}$/;
           let pwd2 = this.$('.pwd2').value.trim();
           let nick = this.$('.nick').value.trim();
           if (!uN) {
               this.$('.userBox .warn').innerHTML = '用户名不能为空';
               return;
           }
           if (!uNreg.test(uN)) {
               this.$('.userBox .warn').innerHTML = '用户名只能是5-24位的小写字母';
               return;
           };
           if (uN && uNreg.test(uN)) this.$('.userBox .warn').innerHTML = '';
           if (!pwd) {
               this.$('.pwdBox .warn').innerHTML = '密码不能为空';
               return;
           }
           if (!pwdReg.test(pwd)) {
               this.$('.pwdBox .warn').innerHTML = '密码可以是6-12位任意的数字字母或下划线';
               return;
           }
           if (pwd && pwdReg.test(pwd)) this.$('.pwdBox .warn').innerHTML = '';
           if (pwd2 != pwd) {
               this.$('.firmPwd .warn').innerHTML = '两次输入的密码不一致,请重新输入';
               return;
           }
           if (pwd2 == pwd) this.$('.firmPwd .warn').innerHTML = '';
           if (!this.$('.deal').checked) throw new Error('请勾选协议');
           axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
           let par5 = `username=${uN}&password=${pwd}&rpassword=${pwd2}&nickname=${nick}`;
           let { status, data } = await axios.post('http://localhost:8888/users/register', par5);
           console.log(data);
           if (data.code == 1) {
               layer.msg('注册成功');
               setTimeout(function () {
                   if (location.search) {
                       location.assign(location.search.split('=')[1]);
                   } else {
                       location.assign('home.html');
                   }
               }, 1200)
           } else if (data.code == 0) {
               document.querySelector('.userBox .warn').innerHTML = data.message;
           }
       } */

    $(ele) {
        let res = document.querySelectorAll(ele);
        return res.length == 1 ? res[0] : res;
    }
}
new User;