import classData from './data/classData.json' with { type: 'json' };
import subjectData from './data/subjectData.json' with { type: 'json' };
import lessonData from './data/lessonData.json' with { type: 'json' };

classData.sort((a,b)=>{
  if(a.roomNo > b.roomNo){
    return 1;
  }else{
    return -1;
  }
});

const timesDatetime= document.getElementById('times-datetime');
const classSelect = document.getElementById('class-select');
const subjectSelect = document.getElementById('subject-select');
const tabWrapper = document.getElementById('tab-wrapper');
const timesArea = document.getElementById('times');
const dateArea = document.getElementById('datetime');
const menuListArea = document.getElementById('menu-list');

createClassSelect();

classSelect.addEventListener('change',()=>{
  clearContents([tabWrapper,menuListArea,dateArea,subjectSelect]);
  timesDatetime.classList.add('u-hide');
  let index = classSelect.selectedIndex;
  let currentClassElm = classSelect.options[index];
  let currentClassId = currentClassElm.dataset.classId;
  subjectSelect.disabled=false;
  createSubjectSelect(currentClassId);
});

const now = new Date();
const datetime = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

subjectSelect.addEventListener('change',(e)=>{
  clearContents([tabWrapper,menuListArea,dateArea]);
  if(timesDatetime.classList.contains('u-hide')){
    timesDatetime.classList.remove('u-hide');
  }
  let index = subjectSelect.selectedIndex;
  let selectedItem = subjectSelect.options[index];
  let selectedLesson = lessonData.find(lesson => lesson.classId == selectedItem.dataset.classId && lesson.subjectId == selectedItem.dataset.subjectId);
  if(selectedLesson){
    let currentLesson = selectedLesson.lessonData;
    currentLesson.forEach((lesson, i) => {
      const tab = document.createElement('li');
      const tabButton = document.createElement('button');
      if (checkDate(datetime, lesson.datetime)) {
        // console.log(lesson.datetime);
        tabButton.classList.add('active');
        displayLesson(lesson);
      }
      if(lesson.assigned){
        tabButton.classList.add('assigned');
      }
      tabButton.insertAdjacentText('beforeend', lesson.times);
      tab.insertAdjacentElement('beforeend', tabButton);
      tabWrapper.insertAdjacentElement('beforeend', tab);
      tabButton.addEventListener('click', (e) => {
        const currentActiveTab = document.querySelector('.active');
        currentActiveTab.classList.remove('active');
        e.target.classList.add('active');
        const targetLessonId = parseInt(e.target.innerText);
        const targetLesson = currentLesson.find((data) => {
          if (targetLessonId === data.times) {
            return data;
          }
        });
        clearContents([menuListArea]);
        displayLesson(targetLesson);
      });
    });
    if(!tabWrapper.querySelector('.active')){
      tabWrapper.querySelector('li:first-child > button').classList.add('active');
      displayLesson(currentLesson[0]);
    }
  }else{
    timesDatetime.classList.add('u-hide');
  }
});

function displayLesson(lesson) {
  timesArea.innerText = lesson.times;
  dateArea.setAttribute('datetime', lesson.datetime);
  dateArea.innerText = lesson.datetime.replace(/-/g, '.');
  lesson.menuList.forEach((menuItem) => {
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

function createClassSelect(){
  classData.forEach((classItem)=>{
    let optElm = document.createElement('option');
    optElm.dataset.classId=classItem.classId;
    optElm.innerText=`${classItem.roomNo}_${classItem.className}`;
    classSelect.append(optElm);
  });
}

function createSubjectSelect(classId){
  tabWrapper.innerHTML= '';
  clearContents([tabWrapper]);
  let currentSubjectObj = subjectData.find((subjectObj)=>subjectObj.classId == classId);
  let optElm = document.createElement('option');
  optElm.hidden = true;
  optElm.innerText = '科目を選択'
  subjectSelect.insertAdjacentElement('afterbegin',optElm);
  currentSubjectObj.subjects.forEach((subject)=>{
    optElm = document.createElement('option');
    optElm.dataset.classId = classId;
    optElm.dataset.subjectId = subject.subjectId;
    optElm.innerText = subject.subjectName;
    subjectSelect.append(optElm);
  })
}

function clearContents(elements){
  elements.forEach((elm)=>{
    elm.innerHTML = '';
  });
}