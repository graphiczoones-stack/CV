import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, Check } from 'lucide-react';
import './SiteTour.css';

const SiteTour = ({ isAr, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState(null);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const requestRef = useRef();
    const lastStepScrolled = useRef(-1);
    const lastPreActionStep = useRef(-1);

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const steps = [
        /* Personal Information */
        {
            target: '#tour-editor-personal',
            title: isAr ? 'المعلومات الشخصية' : 'Personal Information',
            content: isAr ? 'هذا هو القسم المخصص لبياناتك الشخصية. سنشرح لك كل حقل وكيفية ملئه باحترافية.' : 'This is the section for your personal details. We will explain each field and how to fill it professionally.',
        },
        {
            target: '#tour-field-name',
            title: isAr ? 'الاسم الكامل' : 'Full Name',
            content: isAr ? 'اكتب اسمك الحقيقي بالكامل كما يستخدم في السياقات المهنية الرسمية.' : 'Write your full professional name.',
        },
        {
            target: '#tour-field-title',
            title: isAr ? 'المسمى الوظيفي' : 'Job Title',
            content: isAr ? 'هذا هو دورك المهني الحالي أو المستهدف (مثلاً: مطور ويب، مصمم واجهات).' : 'This is your professional role (e.g., Web Developer, UI Designer).',
        },
        {
            target: '#tour-field-email',
            title: isAr ? 'البريد الإلكتروني' : 'Email Address',
            content: isAr ? 'يجب أن يبدو بريدك الإلكتروني احترافياً، ويفضل أن يحتوي على اسمك فقط وتجنب الأرقام العشوائية.' : 'Your email should look professional and ideally contain your name instead of random numbers.',
        },
        {
            target: '#tour-field-phone',
            title: isAr ? 'رقم الهاتف' : 'Phone Number',
            content: isAr ? 'أدخل رقم هاتفك مع التأكد من إضافة مفتاح الدولة لسهولة التواصل.' : 'Your phone number should include the country code.',
        },
        {
            target: '#tour-field-address',
            title: isAr ? 'الموقع' : 'Location',
            content: isAr ? 'الموقع اختياري ولا يحتاج لأن يكون مفصلاً جداً.' : 'Location is optional and does not need to be very detailed.',
        },
        {
            target: '#tour-links-container',
            title: isAr ? 'الروابط' : 'Links',
            content: isAr ? 'يمكنك هنا إضافة روابطك المهمة مثل LinkedIn أو GitHub أو موقعك الشخصي.' : 'You can add portfolio links such as LinkedIn, GitHub, or personal website.',
        },
        {
            target: '#tour-add-link',
            title: isAr ? 'إضافة رابط' : 'Add Link',
            content: isAr ? 'اضغط هنا لإضافة رابط جديد لملفاتك الشخصية.' : 'Click here to add a new link to your profiles.',
        },
        {
            target: '#tour-link-label',
            title: isAr ? 'اسم الرابط' : 'Link Label',
            content: isAr ? 'اكتب اسم الرابط (مثلاً: LinkedIn أو GitHub).' : 'Write the label for your link (e.g., LinkedIn or GitHub).',
            preAction: () => {
                const addBtn = document.getElementById('tour-add-link');
                const firstInput = document.getElementById('tour-link-label');
                if (!firstInput && addBtn) addBtn.click();
            }
        },
        {
            target: '#tour-link-url',
            title: isAr ? 'رابط الصفحة' : 'Link URL',
            content: isAr ? 'أدخل الرابط الكامل لصفحتك.' : 'Enter the full URL to your page.',
        },
        {
            target: '#tour-field-summary',
            title: isAr ? 'الملخص المهني' : 'Professional Summary',
            content: isAr ? 'اكتب نبذة مختصرة واحترافية عن خبراتك وأهم مهاراتك.' : 'Write a short professional summary describing your experience and skills.',
        },

        /* Experience */
        {
            target: '#tour-section-experience .editor-section-title',
            title: isAr ? 'الخبرة العملية' : 'Experience Section',
            content: isAr ? 'هذا القسم يعرض تاريخك الوظيفي. سنقوم بشرحه الان.' : 'This section showcases your job history. Let\'s explore it.',
        },
        {
            target: '#tour-add-experience',
            title: isAr ? 'إضافة خبرة' : 'Add Experience',
            content: isAr ? 'اضغط هنا لإضافة وظيفة جديدة إلى قائمتك.' : 'Click this button to add a new job to your list.',
        },
        {
            target: '#tour-exp-position',
            title: isAr ? 'المسمى الوظيفي' : 'Job Position',
            content: isAr ? 'اكتب تخصصك الدقيق في الشركة.' : 'Write your exact specialization or job position in the company.',
            preAction: () => {
                const addExpBtn = document.getElementById('tour-add-experience');
                const firstExpInput = document.getElementById('tour-exp-position');

                if (!firstExpInput && addExpBtn) {
                    addExpBtn.click();
                } else if (firstExpInput) {
                    const listItem = firstExpInput.closest('.list-item');
                    if (listItem && !listItem.classList.contains('expanded')) {
                        listItem.click();
                    }
                }
            }
        },
        {
            target: '#tour-exp-company',
            title: isAr ? 'اسم الشركة' : 'Company Name',
            content: isAr ? 'أدخل اسم المؤسسة أو الشركة التي عملت بها.' : 'Enter the name of the company or organization you worked for.',
        },
        {
            target: '#tour-exp-start',
            title: isAr ? 'تاريخ البدء' : 'Start Date',
            content: isAr ? 'أدخل تاريخ التحاقك بالعمل.' : 'Enter your start date for this position.',
        },
        {
            target: '#tour-exp-end',
            title: isAr ? 'تاريخ الانتهاء' : 'End Date',
            content: isAr ? 'أدخل تاريخ انتهاء العمل.' : 'Enter your end date for this position.',
        },
        {
            target: '#tour-exp-description',
            title: isAr ? 'الوصف والمسؤوليات' : 'Job Description / Responsibilities',
            content: isAr ? 'اشرح مهامك وإنجازاتك الرئيسية في هذه الوظيفة.' : 'Explain your key tasks and responsibilities in this role.',
        },
        {
            target: '#tour-add-responsibility',
            title: isAr ? 'إضافة مسؤولية' : 'Add Responsibility',
            content: isAr ? 'اضغط هنا لإضافة نقطة جديدة تشرح فيها مسؤولية أو إنجاز إضافي.' : 'Click here to add another bullet point explaining a responsibility or achievement.',
        },

        /* Education */
        {
            target: '#tour-section-education',
            title: isAr ? 'التعليم' : 'Education Section',
            content: isAr ? 'هذا القسم مخصص لمؤهلاتك العلمية.' : 'This section is for your educational background.',
        },
        {
            target: '#tour-add-education',
            title: isAr ? 'إضافة تعليم' : 'Add Education',
            content: isAr ? 'اضغط هنا لإدخال مرحلة تعليمية جديدة.' : 'Click here to add a new educational degree.',
        },
        {
            target: '#tour-edu-degree',
            title: isAr ? 'الدرجة العلمية' : 'Degree',
            content: isAr ? 'اكتب درجتك العلمية (مثلاً: بكالوريوس في علوم الحاسب).' : 'Write your degree (e.g., Bachelor of Computer Science).',
            preAction: () => {
                const addBtn = document.getElementById('tour-add-education');
                const firstInput = document.getElementById('tour-edu-degree');
                if (!firstInput && addBtn) addBtn.click();
                else if (firstInput) {
                    const listItem = firstInput.closest('.list-item');
                    if (listItem && !listItem.classList.contains('expanded')) listItem.click();
                }
            }
        },
        {
            target: '#tour-edu-institution',
            title: isAr ? 'الجامعة أو المعهد' : 'Institution',
            content: isAr ? 'أدخل اسم الجامعة أو المعهد الذي درست فيه.' : 'Enter the name of the university or institution.',
        },
        {
            target: '#tour-edu-location',
            title: isAr ? 'الموقع' : 'Location',
            content: isAr ? 'أين يقع مكان دراستك؟' : 'Where is the institution located?',
        },
        {
            target: '#tour-edu-start',
            title: isAr ? 'تاريخ البدء' : 'Start Date',
            content: isAr ? 'سنة بدء الدراسة.' : 'Year you started studying.',
        },
        {
            target: '#tour-edu-end',
            title: isAr ? 'تاريخ الانتهاء' : 'End Date',
            content: isAr ? 'سنة التخرج أو الانتهاء.' : 'Year of graduation or expected graduation.',
        },
        {
            target: '#tour-edu-description',
            title: isAr ? 'الوصف' : 'Description',
            content: isAr ? 'يمكنك هنا كتابة معدلك أو تفاصيل إضافية هامة.' : 'You can write your GPA or important additional details here.',
        },

        /* Skills */
        {
            target: '#tour-section-skills',
            title: isAr ? 'المهارات' : 'Skills Section',
            content: isAr ? 'هنا ستضيف مهاراتك التقنية والشخصية لتقوية سيرتك الذاتية.' : 'Here you will add your technical and soft skills to strengthen your CV.',
        },
        {
            target: '#tour-skills-tech',
            title: isAr ? 'المهارات التقنية' : 'Technical Skills',
            content: isAr ? 'اكتب مهاراتك التقنية المتخصصة مثل لغات البرمجة أو الأدوات وافصل بينها بفاصلة.' : 'Write your specialized technical skills like programming languages or tools, separated by commas.',
        },
        {
            target: '#tour-skills-soft',
            title: isAr ? 'المهارات الشخصية' : 'Soft Skills',
            content: isAr ? 'المهارات الشخصية مثل التواصل والعمل الجماعي وحل المشكلات وافصل بينها بفاصلة.' : 'Soft skills like communication, teamwork, and problem solving, separated by commas.',
        },

        /* Courses */
        {
            target: '#tour-section-certifications',
            title: isAr ? 'الشهادات والدورات' : 'Certifications & Courses',
            content: isAr ? 'أضف الدورات التدريبية والشهادات الاحترافية التي حصلت عليها.' : 'Add your training courses and professional certifications.',
        },
        {
            target: '#tour-add-course',
            title: isAr ? 'إضافة دورة' : 'Add Course',
            content: isAr ? 'اضغط هنا لإضافة دورة تدريبية.' : 'Click here to add a training course.',
        },
        {
            target: '#tour-course-name',
            title: isAr ? 'اسم الدورة' : 'Course Name',
            content: isAr ? 'اكتب اسم الدورة أو الشهادة.' : 'Write the name of the course or certificate.',
            preAction: () => {
                const addBtn = document.getElementById('tour-add-course');
                const firstInput = document.getElementById('tour-course-name');
                if (!firstInput && addBtn) addBtn.click();
                else if (firstInput) {
                    const listItem = firstInput.closest('.list-item-compact');
                    if (listItem && !listItem.classList.contains('expanded')) listItem.click();
                }
            }
        },
        {
            target: '#tour-course-provider',
            title: isAr ? 'الجهة المانحة' : 'Provider',
            content: isAr ? 'الجهة أو المنصة التي منحتك الشهادة.' : 'The organization or platform that provided the certificate.',
        },
        {
            target: '#tour-course-year',
            title: isAr ? 'السنة' : 'Year',
            content: isAr ? 'سنة الحصول على الدورة.' : 'Year you obtained the course.',
        },
        {
            target: '#tour-course-hours',
            title: isAr ? 'عدد الساعات' : 'Hours',
            content: isAr ? 'عدد ساعات الدورة إن وجدت.' : 'Number of hours for the course if applicable.',
        },
        {
            target: '#tour-course-link',
            title: isAr ? 'رابط الشهادة' : 'Certificate URL',
            content: isAr ? 'رابط للشهادة على الإنترنت إن توفر.' : 'URL to the specific certificate online if available.',
        },

        /* Projects */
        {
            target: '#tour-section-projects',
            title: isAr ? 'المشاريع' : 'Projects',
            content: isAr ? 'أضف أي مشاريع مميزة قمت بتطويرها لتعزيز ملفك.' : 'Add any standout projects you\'ve developed to boost your profile.',
        },
        {
            target: '#tour-add-project',
            title: isAr ? 'إضافة مشروع' : 'Add Project',
            content: isAr ? 'اضغط هنا للبدء في إضافة مشروع.' : 'Click here to start adding a project.',
        },
        {
            target: '#tour-project-name',
            title: isAr ? 'اسم المشروع' : 'Project Name',
            content: isAr ? 'اكتب عنوان أو اسم المشروع.' : 'Write the title or name of the project.',
            preAction: () => {
                const addBtn = document.getElementById('tour-add-project');
                const firstInput = document.getElementById('tour-project-name');
                if (!firstInput && addBtn) addBtn.click();
                else if (firstInput) {
                    const listItem = firstInput.closest('.list-item');
                    if (listItem && !listItem.classList.contains('expanded')) listItem.click();
                }
            }
        },
        {
            target: '#tour-project-link',
            title: isAr ? 'رابط المشروع' : 'Project URL',
            content: isAr ? 'أضف رابط العرض الحي أو مستودع الكود للمشروع.' : 'Add the live demo or code repository link for the project.',
        },
        {
            target: '#tour-project-description',
            title: isAr ? 'وصف المشروع' : 'Project Description',
            content: isAr ? 'اكتب وصفاً قصيراً جداً يوضح فكرة وتقنيات المشروع.' : 'Write a very brief description outlining the idea and technologies of the project.',
        },

        /* Activities */
        {
            target: '#tour-section-activities',
            title: isAr ? 'الأنشطة الطلابية والتطوعية' : 'Extracurricular Activities',
            content: isAr ? 'هل لديك أدوار في أنشطة خارجية أو أعمال تطوعية؟ يمكنك إضافتها هنا.' : 'Do you have roles in external activities or volunteer work? Add them here.',
        },
        {
            target: '#tour-add-activity',
            title: isAr ? 'إضافة نشاط' : 'Add Activity',
            content: isAr ? 'اضغط هنا للبدء في إضافة نشاط.' : 'Click here to start adding an activity.',
        },
        {
            target: '#tour-activity-name',
            title: isAr ? 'اسم المنظمة أو النشاط' : 'Organization / Event',
            content: isAr ? 'أدخل اسم الفريق أو النشاط.' : 'Enter the name of the team or activity.',
            preAction: () => {
                const addBtn = document.getElementById('tour-add-activity');
                const firstInput = document.getElementById('tour-activity-name');
                if (!firstInput && addBtn) addBtn.click();
                else if (firstInput) {
                    const listItem = firstInput.closest('.list-item');
                    if (listItem && !listItem.classList.contains('expanded')) listItem.click();
                }
            }
        },
        {
            target: '#tour-activity-role',
            title: isAr ? 'الدور' : 'Role',
            content: isAr ? 'ما هو دورك في هذا النشاط؟' : 'What was your role in this activity?',
        },
        {
            target: '#tour-activity-description',
            title: isAr ? 'الوصف' : 'Description',
            content: isAr ? 'اشرح تأثيرك ومساهماتك في هذا النشاط.' : 'Explain your impact and contributions in this activity.',
        },

        /* Languages */
        {
            target: '#tour-section-languages',
            title: isAr ? 'اللغات' : 'Languages',
            content: isAr ? 'في هذا القسم ستضيف اللغات التي تجيدها.' : 'In this section, you will add the languages you are proficient in.',
        },
        {
            target: '#tour-add-language',
            title: isAr ? 'إضافة لغة' : 'Add Language',
            content: isAr ? 'اضغط هنا لإضافة لغة جديدة. سنتوقف عند هذه الخطوة.' : 'Click here to add a new language. We will stop at this step.',
            preAction: () => {
                const addBtn = document.getElementById('tour-add-language');
                const firstInput = document.getElementById('tour-section-languages'); // Just target the section
                // preAction reserved
            }
        },
        {
            target: '#cv-content',
            title: isAr ? 'معاينة الصفحة (A4)' : 'CV Preview (A4)',
            content: isAr ? 'هذه هي الورقة النهائية التي ستظهر عند الطباعة. أي تعديل تقوم به سيظهر هنا فوراً.' : 'This is the final paper that will appear when printing. Any changes you make will appear here instantly.',
        },
        {
            target: '[id^="tour-preview-controls-"]',
            title: isAr ? 'ترتيب الأقسام' : 'Section Reordering',
            content: isAr ? 'يمكنك استخدام هذه الأسهم لرفع قسم أو تنزيله داخل الورقة لتنظيم سيرتك الذاتية كما تحب.' : 'You can use these arrows to move a section up or down within the paper to organize your CV as you like.',
        }
    ];

    const updatePosition = useCallback(() => {
        const step = steps[currentStep];
        if (!step) return;

        let el = document.querySelector(step.target);

        if (step.preAction && lastPreActionStep.current !== currentStep) {
            lastPreActionStep.current = currentStep;
            step.preAction();
        }

        if (!el) {
            el = document.querySelector(step.target);
        }

        if (el) {
            const rect = el.getBoundingClientRect();

            // Only track and scroll if the element is visible
            if (rect.width > 0 && rect.height > 0) {
                setTargetRect(prev => {
                    if (!prev ||
                        Math.abs(rect.top - prev.top) > 1 ||
                        Math.abs(rect.left - prev.left) > 1 ||
                        Math.abs(rect.width - prev.width) > 1 ||
                        Math.abs(rect.height - prev.height) > 1) {
                        return {
                            top: rect.top,
                            left: rect.left,
                            bottom: rect.bottom,
                            right: rect.right,
                            width: rect.width,
                            height: rect.height
                        };
                    }
                    return prev;
                });

                if (lastStepScrolled.current !== currentStep) {
                    lastStepScrolled.current = currentStep;
                    setTimeout(() => {
                        const currentEl = document.querySelector(step.target);
                        if (currentEl) {
                            const bounds = currentEl.getBoundingClientRect();
                            const headerOffset = 100; // Leave space for headers
                            const isFullyVisible = bounds.top >= headerOffset && bounds.bottom <= (window.innerHeight - headerOffset);
                            if (!isFullyVisible) {
                                currentEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                        }
                    }, 100);
                }
            }
        }

        requestRef.current = requestAnimationFrame(updatePosition);
    }, [currentStep]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(updatePosition);
        return () => cancelAnimationFrame(requestRef.current);
    }, [updatePosition]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const getCardPosition = () => {
        if (!targetRect) return {};

        const cardWidth = Math.min(360, windowSize.width - 24);
        const cardHeight = 250;
        const margin = 16;

        let top = targetRect.bottom + margin;
        let left = targetRect.left + (targetRect.width / 2) - (cardWidth / 2);

        if (top + cardHeight > windowSize.height) {
            top = targetRect.top - cardHeight - margin;
            if (top < margin) {
                top = windowSize.height - cardHeight - margin;
            }
        }

        if (left < margin) {
            left = margin;
        } else if (left + cardWidth > windowSize.width - margin) {
            left = windowSize.width - cardWidth - margin;
        }

        return { top, left, width: cardWidth };
    };

    if (!targetRect) return null;

    const cardPos = getCardPosition();

    return (
        <div className={`site-tour-overlay ${isAr ? 'rtl' : ''}`}>
            <div className="tour-mask top" style={{ height: Math.max(0, targetRect.top - 8) }}></div>
            <div className="tour-mask bottom" style={{ top: targetRect.bottom + 8 }}></div>
            <div className="tour-mask left" style={{
                top: Math.max(0, targetRect.top - 8),
                height: targetRect.height + 16,
                width: Math.max(0, targetRect.left - 8)
            }}></div>
            <div className="tour-mask right" style={{
                top: Math.max(0, targetRect.top - 8),
                height: targetRect.height + 16,
                left: targetRect.right + 8
            }}></div>

            <motion.div
                className="tour-spotlight"
                initial={false}
                animate={{
                    top: targetRect.top - 8,
                    left: targetRect.left - 8,
                    width: targetRect.width + 16,
                    height: targetRect.height + 16,
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.5 }}
            />

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    className="tour-card"
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        top: cardPos.top,
                        left: cardPos.left,
                        width: cardPos.width,
                    }}
                    exit={{ opacity: 0, scale: 0.9, y: -15 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                >
                    <div className="tour-card-header">
                        <div className="tour-title-group">
                            <span className="step-count">{isAr ? 'خطوة' : 'Step'} {currentStep + 1} / {steps.length}</span>
                            <h3>{steps[currentStep].title}</h3>
                        </div>
                        <button className="tour-close" onClick={onClose} title={isAr ? 'إغلاق' : 'Close'}>
                            <X size={22} />
                        </button>
                    </div>
                    <div className="tour-card-body">
                        <p>{steps[currentStep].content}</p>
                    </div>
                    <div className="tour-actions">
                        <div className="tour-indicators">
                            {steps.length <= 20 && steps.map((_, i) => (
                                <div key={i} className={`indicator ${i === currentStep ? 'active' : ''}`} />
                            ))}
                        </div>
                        <div className="tour-nav-btns">
                            {currentStep > 0 && (
                                <button className="tour-nav-btn secondary" onClick={handleBack}>
                                    {isAr ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                                    {isAr ? 'السابق' : 'Back'}
                                </button>
                            )}
                            <button className="tour-nav-btn primary" onClick={handleNext}>
                                {currentStep === steps.length - 1
                                    ? (isAr ? 'تم' : 'Finish')
                                    : (isAr ? 'التالي' : 'Next')}
                                {currentStep === steps.length - 1 ? <Check size={18} /> : (isAr ? <ChevronLeft size={18} /> : <ChevronRight size={18} />)}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default SiteTour;
