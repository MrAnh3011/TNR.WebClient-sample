export const menus = [
    {
        'name': 'Dashboard',
        'icon': 'dashboard',
        'open': true,
        'chip': { 'value': 1, 'color': 'accent' },
        'link': '/admin/dashboard',
    },
    {
        'name': 'Chức năng',
        'icon': 'flash_on',
        'link': false,
        'open': false,
        'chip': { 'value': 1, 'color': 'accent' },
        'sub': [
            {
                'name': 'Thông báo',
                'link': '/admin/search/notification',
                'icon': 'notifications',
                'chip': false,
                'open': true,
            },
            {
                'name': 'Yêu cầu',
                'link': '/admin/search/request',
                'icon': 'message',
                'chip': false,
                'open': true,
            },
            {
                'name': 'QL Khách hàng',
                'link': '/admin/search/customer',
                'icon': 'supervisor_account',
                'chip': false,
                'open': true,
            },
        ]
    },
    {
        'name': 'Danh mục',
        'icon': 'reorder',
        'link': false,
        'open': false,
        'chip': { 'value': 1, 'color': 'accent' },
        'sub': [
            {
                'name': 'Mẫu thông báo',
                'link': '/admin/search/notification-template',
                'icon': 'question_answer',
                'chip': false,
                'open': true,
            },
            {
                'name': 'Loại yêu cầu',
                'link': '/admin/search/request-type',
                'icon': 'question_answer',
                'chip': false,
                'open': true,
            },
            {
                'name': 'Phòng ban',
                'link': '/admin/search/department',
                'icon': 'question_answer',
                'chip': false,
                'open': true,
            },
            {
                'name': 'Tòa nhà',
                'link': '/admin/search/building',
                'icon': 'home',
                'chip': false,
                'open': true,
            },
        ]
    },
    {
        'name': 'Hệ thống',
        'icon': 'settings',
        'link': false,
        'open': false,
        'chip': { 'value': 1, 'color': 'accent' },
        'sub': [
            {
                'name': 'Người dùng',
                'link': '/admin/search/user',
                'icon': 'flash_on',
                'chip': false,
                'open': true,
            },
            {
                'name': 'Chức năng',
                'link': '/admin/search/deffunc',
                'icon': 'supervisor_account',
                'chip': false,
                'open': true,
            },
            {
                'name': 'Menu',
                'link': '/admin/search/defmenu',
                'icon': 'reorder',
                'chip': false,
                'open': true,
            },
            {
                'name': 'Cài đặt',
                'link': '/admin/setting',
                'icon': 'build',
                'chip': false,
                'open': true,
            },
        ]
    }
];
