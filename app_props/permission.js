/**
 * permission
 */
define(function() {

    //子级菜单关联父菜单
    var rs = {
        'menu.query': [
            'menu.query1',
            'menu.query2',
            'menu.query3'
        ],

        'menu.query1': [
            'menu.query1-1'
        ],

        'menu.query1-1': [
            'menu.query1-1-1'
        ],

        'menu.algo': [
            'menu.algo1',
            'menu.algo2',
            'menu.algo3'
        ],

        'menu.algo1': [
            'menu.algo1-1'
        ]
    };

    //菜单权限
    var rs2pm = {
        'menu.query1-1-1': [
            'system:test:c',
            'system:test:r'
        ],

        'menu.query2': [
            'system:test:s'
        ],

        'menu.query3': [
            'system:test:s'
        ],

        'menu.algo1-1': [
            'system:test:u'
        ],

        'menu.algo2': [
            'system:test:s'
        ],

        'menu.algo3': [
            'system:test:s'
        ]
    };

    var _filters = {
        //特殊菜单做拦截处理
        'org.add': function () {
            //return Ctx.getBrhLevel() < 6;
        }
    };

    return {

        //某些特殊的权限码特殊处理
        filter: function (rsId) {
            return _filters[rsId] ? _filters[rsId]() : true;
        },

        has: function (rsId, pmsMap) {
            return this.filter(rsId) && this._has(rsId, pmsMap);
        },

        _has: function(rsId, pmsMap) {
            //超级权限(*)直接返回
            if (pmsMap['*']) {
                return true;
            }

            //判断权限码是否存在
            if (!rsId || !pmsMap) {
                return false;
            }

            var pms = $.makeArray(rs2pm[rsId] || []);
            var refs = rs[rsId] || [];
            var i, ln;

            //是否配置关联菜单和对应权限
            if (!pms.length && !refs.length) {
                return false;
            }

            //权限过滤
            for (i = 0, ln = pms.length; i < ln; i++) {
                var auth = pms[i];
                var parts = auth.split(':');
                if (parts.length === 3) {
                    var bag = [
                        auth,
                        parts[0] + ':' + parts[1] + ':*',
                        parts[0] + ':*:' + parts[2],
                        parts[0] + ':*', '*'
                    ];
                    for (var j = 0, jlen = bag.length; j < jlen; j++) {
                        if (pmsMap[bag[j]]) {
                            return true;
                        }
                    }
                } else if (pmsMap[auth]) {
                    return true;
                }
            }

            //递归
            for (i = 0, ln = refs.length; i < ln; i++) {
                if (this.has(refs[i], pmsMap)) {
                    return true;
                }
            }

            return false;
        }
    };
});
