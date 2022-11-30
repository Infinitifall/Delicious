function toggle_theme() {
    var theme_obj;

    if (localStorage.getItem('theme') === null) {
        theme_obj = {'theme': 'light'};

    } else {
        theme_obj = JSON.parse(localStorage.getItem('theme'));

        if (theme_obj['theme'] == 'dark') {
            theme_obj['theme'] = 'light';
        } else {
            theme_obj['theme'] = 'dark';
        }
    }

    localStorage.setItem('theme', JSON.stringify(theme_obj));
    apply_theme();
}

function apply_theme() {
    if (localStorage.getItem('theme') === null) {
        root.className = 'light';

    } else {
        var theme_obj = JSON.parse(localStorage.getItem('theme'));
        var root = document.getElementById('root');
        var theme_toggle = document.getElementById('theme-toggle');
        
        if (theme_obj['theme'] == 'dark') {
            root.className = 'dark';
            theme_toggle.innerHTML = '☀️';
        } else {
            root.className = 'light';
            theme_toggle.innerHTML = '🌙';
        }
    }
}

apply_theme();
