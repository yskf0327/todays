import lessonData from './data/lessonData.js';

const tabWrapper = document.getElementById('tab-wrapper');

const timesArea = document.getElementById('times');
const dateArea = document.getElementById('datetime');
const menuListArea = document.getElementById('menu-list');

const now = new Date();
const datetime = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

const todaysLesson = lessonData.find((data) => {
  if (checkDate(datetime, data.datetime)) {
    return data;
  } else {
    return false;
  }
});

console.log(todaysLesson);

if (todaysLesson) {
  displayLesson(todaysLesson);
} else {
  displayLesson(lessonData[0]);
}

lessonData.forEach((lesson, i) => {
  const tab = document.createElement('li');
  const tabButton = document.createElement('button');
  if (checkDate(datetime, lesson.datetime)) {
    tabButton.classList.add('active');
  } else if (i === 0) {
    tabButton.classList.add('active');
  }
  tabButton.insertAdjacentText('beforeend', lesson.times);
  tab.insertAdjacentElement('beforeend', tabButton);
  tabWrapper.insertAdjacentElement('beforeend', tab);

  tabButton.addEventListener('click', (e) => {
    const currentActiveTab = document.querySelector('.active');
    currentActiveTab.classList.remove('active');
    e.target.classList.add('active');
    const targetLessonId = parseInt(e.target.innerText);
    // console.log(targetLessonId);
    const targetLesson = lessonData.find((data) => {
      // console.log(data.times);
      if (targetLessonId === data.times) {
        return data;
      }
    });
    // console.log(targetLesson);

    menuListArea.innerHTML = '';
    displayLesson(targetLesson);
  });
});

function displayLesson(lesson) {
  timesArea.innerText = lesson.times;
  dateArea.setAttribute('datetime', lesson.datetime);
  dateArea.innerText = lesson.datetime.replace(/-/g, '.');
  lesson.menuList.forEach((menuItem) => {
    // console.log(menuItem);
    const menuListItem = document.createElement('li');
    menuListItem.classList.add('p-menu-list__item');
    menuListItem.insertAdjacentHTML('beforeend', `<span>${menuItem}</span>`);
    menuListArea.append(menuListItem);
  });
}

function checkDate(datetime, target) {
  if (datetime === target) {
    return true;
  } else {
    return false;
  }
}
