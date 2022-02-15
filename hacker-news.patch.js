function apply() {
    document.querySelectorAll('.athing').forEach((elem) => {
        const button = htmlToElement(`<button>+</button>`);
        elem.append(button);
        const link = elem.querySelector('a.titlelink');
        button.onclick = () => {
            const now = Date.now()
            const data = {
                href: link.href,
                title: link.innerText,
                date: now
            }
            localStorage.setItem(getStorageKey(data.href), JSON.stringify(data));
        }
    }
    )

    const bookmarkButton = htmlToElement('<button>Saved</button>');
    document.querySelector('.pagetop').appendChild(bookmarkButton);

    const itemlist = document.querySelector('.itemlist');
    bookmarkButton.onclick = () => {
        itemlist.innerText = ''

        itemsHTML = getAll().map((({ href, title }, index) => {
            const itemTemplate = `<tr class="athing" id="entry-${index}">
            <td align="right" valign="top" class="title"><span class="rank">${index + 1}.</span></td>
            <td></td>
            <td class="title">
                <a
                href="${href}"
                class="titlelink">${title}</a>
            </td>
            <td>
                <button onclick="deleteLink('${href}', ${index})">X</button>
            </td>
            </tr>
            <tr>
                <td class="subtext"><br/></td>
            </tr>
        `
            return itemTemplate;
        }));

        const finalHTML = `<tbody>${itemsHTML}</tbody>`;
        itemlist.append(htmlToElement(finalHTML));
    }

    function htmlToElement(html) {
        var template = document.createElement("template");
        html = html.trim();
        // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    function getAll() {
        return Object.entries(localStorage)
            .filter(([key]) => (key.startsWith(storageKeyPrefix)))
            .map(i => JSON.parse(i[1]))
            .sort((i, j) => (j.date - i.date));
    }
}

const storageKeyPrefix = 'hacker-news';

function getStorageKey(href) {
    return `${storageKeyPrefix}-${href}`
}

function deleteLink(href, index) {
    document.getElementById(`entry-${index}`).remove();
    localStorage.removeItem(getStorageKey(href));
}

const targetURL = location.href.replace(location.origin, 'https://news.ycombinator.com');
const cors = "https://ncert.centralindia.cloudapp.azure.com:8080";
fetch(`${cors}/${targetURL}`).then(t => t.text()).then(t => {
    document.body.innerHTML = t;
    apply();
});