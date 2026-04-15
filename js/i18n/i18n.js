'use strict';

function applyTranslations(locale) {
    const dict     = window.translations?.[locale]     ?? {};
    const dictHTML = window.translationsHTML?.[locale] ?? {};

    const textElements = document.querySelectorAll('[data-i18n]');
    for (let i = 0; i < textElements.length; i++) {
        const el  = textElements[i];
        const key = el.dataset.i18n;
        if (dict[key] !== undefined) {
            el.textContent = dict[key];
        }
    }

    const labelElements = document.querySelectorAll('[data-i18nlabel]');
    for (let i = 0; i < labelElements.length; i++) {
        const el  = labelElements[i];
        const key = el.dataset.i18nlabel;
        if (dict[key] !== undefined) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.setAttribute('placeholder', dict[key]);
            } else if (el.tagName === 'IMG') {
                el.setAttribute('alt', dict[key]);
            } else {
                el.setAttribute('label', dict[key]);
            }
        }
    }

    const htmlElements = document.querySelectorAll('[data-i18n-html]');
    for (let i = 0; i < htmlElements.length; i++) {
        const el  = htmlElements[i];
        const key = el.dataset.i18nHtml;
        if (dictHTML[key] !== undefined) {
            el.innerHTML = dictHTML[key];
        }
    }
    document.documentElement.lang = locale === 'en' ? 'en-GB' : 'es-ES';
}

function setLocale(locale) {
    const selectedLocale = window.translations[locale] ? locale : 'es';
    localStorage.setItem('preferredLanguage', selectedLocale);
    applyTranslations(selectedLocale);
    updateDynamicContent(selectedLocale);
    initializeLanguageSwitcher(selectedLocale);
}

window.setLocale = setLocale;

function getSavedLocale() {
    const savedLocale = localStorage.getItem('preferredLanguage');
    return savedLocale ?? 'es';
}

function initializeLanguageSwitcher(locale) {
    const switcher = document.querySelector('#language-switcher');
    if (switcher) {
        switcher.value = locale;
    }
}

function initializeI18n() {
    const textEls  = document.querySelectorAll('[data-i18n]');
    const htmlEls  = document.querySelectorAll('[data-i18n-html]');
    const switcher = document.querySelector('#language-switcher');

    if (textEls.length === 0 && htmlEls.length === 0 && !switcher) {
        console.log('Esta página todavía no está preparada para i18n.');
        return;
    }

    const initialLocale = getSavedLocale();
    applyTranslations(initialLocale);
    updateDynamicContent(initialLocale);
    initializeLanguageSwitcher(initialLocale);
}
initializeI18n();

function formatDate(dateValue, locale) {
    const resolvedLocale = locale === 'en' ? 'en-GB' : 'es-ES';
    return new Intl.DateTimeFormat(resolvedLocale, {
        dateStyle: 'long',
        timeStyle: 'short'
    }).format(dateValue);
}

function formatCurrency(amount, locale) {
    const resolvedLocale = locale === 'en' ? 'en-GB' : 'es-ES';
    const currency       = locale === 'en' ? 'GBP'   : 'EUR';
    return new Intl.NumberFormat(resolvedLocale, {
        style: 'currency',
        currency: currency
    }).format(amount);
}

function updateDynamicContent(locale) {
    const meetingDateBox  = document.querySelector('#monthlymeeting-date');
    const meetingFeeBox   = document.querySelector('#monthly-meetingfee');
    const meetingSummary  = document.querySelector('#meeting-summary');

    if (meetingDateBox) {
        const rawDate   = meetingDateBox.dataset.date;
        const meetingDate = new Date(rawDate);
        meetingDateBox.textContent = formatDate(meetingDate, locale);
    }

    if (meetingFeeBox) {
        const rawFee = Number(meetingFeeBox.dataset.fee);
        meetingFeeBox.textContent = formatCurrency(rawFee, locale);
    }

    if (meetingSummary) {
        meetingSummary.textContent = buildMeetingSummary(locale);
    }
}

function buildMeetingSummary(locale) {
    const meetingDateBox  = document.querySelector('#monthlymeeting-date');
    const meetingFeeBox   = document.querySelector('#monthly-meetingfee');
    const meetingPlaceBox = document.querySelector('[data-i18n="events.monthlyMeeting.placeValue"]');
    const bookTitleBox    = document.querySelector('[data-i18n="events.monthlyMeeting.bookTitle"]');

    const formattedDate = meetingDateBox  ? meetingDateBox.textContent  : '';
    const formattedFee  = meetingFeeBox   ? meetingFeeBox.textContent   : '';
    const place         = meetingPlaceBox ? meetingPlaceBox.textContent : '';
    const bookTitle     = bookTitleBox    ? bookTitleBox.textContent    : '';

    if (locale === 'en') {
        return `Our next monthly meeting will take place on ${formattedDate} at ${place}. ` +
               `We will discuss ${bookTitle}, and the current fee is ${formattedFee}.`;
    }
    return `Nuestro próximo encuentro mensual será el ${formattedDate} en ${place}. ` +
           `Hablaremos sobre ${bookTitle} y la cuota actual es ${formattedFee}.`;
}