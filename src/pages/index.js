import Layout from "@/components/Layout";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";

const Dashboard = () => {
    const [subjects, setSubjects] = useState([]);

    let [isOpen, setIsOpen] = useState(false);

    let [cards, setCards] = useState([]);
    let [index, setIndex] = useState(0);

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    useEffect(() => {
        async function fetchSubjects() {
            const response = await fetch("/api/subjects");
            const subjects = await response.json();
            setSubjects(subjects);
        }

        fetchSubjects();
    }, []);

    return (
        <Layout title="Teacher Dashboard">
            <div className="bg-gray-800 py-10 px-4">
                <h2 className="text-3xl font-bold text-white mb-4 mx-4">
                    Dashboard
                </h2>
                <div className="my-8"></div>
                {subjects.map((subject) => (
                    <div className="mx-2 my-5" key={subjects.indexOf(subject)}>
                        <div className="mx-auto w-full rounded-2xl bg-white p-2">
                            <h2 className="text-2xl font-bold text-black my-4 mx-2 ">
                                {subject.name}
                            </h2>
                            {subject.lectures.map((lec) => (
                                <div
                                    className="my-4"
                                    key={subject.lectures.indexOf(lec)}
                                >
                                    <Disclosure>
                                        {({ open }) => (
                                            <>
                                                <Disclosure.Button className="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                                                    <span>{lec.name}</span>
                                                    <ChevronUpIcon
                                                        className={`${
                                                            open
                                                                ? "rotate-180 transform"
                                                                : ""
                                                        } h-5 w-5 text-blue-500`}
                                                    />
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 display-linebreak h-full">
                                                    <h1 className="">
                                                        {lec.summary}
                                                    </h1>
                                                    {lec.quiz && (
                                                        <div className="mt-4 flex gap-4">
                                                            <Link
                                                                className="px-2 py-1 bg-blue-900 rounded-md text-white"
                                                                href={
                                                                    "/quiz/" +
                                                                    subject._id +
                                                                    "-" +
                                                                    lec._id
                                                                }
                                                            >
                                                                Quiz
                                                            </Link>
                                                            <>
                                                                <div className="flex items-center justify-center">
                                                                    <button
                                                                        type="button"
                                                                        onClick={async (
                                                                            e
                                                                        ) => {
                                                                            e.preventDefault();
                                                                            openModal();

                                                                            let res =
                                                                                await axios.post(
                                                                                    "/api/findCards",
                                                                                    {
                                                                                        subjectId:
                                                                                            subject._id,
                                                                                        lectureName:
                                                                                            lec.name,
                                                                                    }
                                                                                );

                                                                            setCards(
                                                                                res
                                                                                    .data
                                                                                    .flashcards
                                                                            );
                                                                        }}
                                                                        className="px-2 py-1 bg-blue-900 rounded-md text-white"
                                                                    >
                                                                        Flash
                                                                        Cards
                                                                    </button>
                                                                </div>

                                                                <Transition
                                                                    appear
                                                                    show={
                                                                        isOpen
                                                                    }
                                                                    as={
                                                                        Fragment
                                                                    }
                                                                >
                                                                    <Dialog
                                                                        as="div"
                                                                        className="relative z-10"
                                                                        onClose={
                                                                            closeModal
                                                                        }
                                                                    >
                                                                        <Transition.Child
                                                                            as={
                                                                                Fragment
                                                                            }
                                                                            enter="ease-out duration-300"
                                                                            enterFrom="opacity-0"
                                                                            enterTo="opacity-100"
                                                                            leave="ease-in duration-200"
                                                                            leaveFrom="opacity-100"
                                                                            leaveTo="opacity-0"
                                                                        >
                                                                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                                                                        </Transition.Child>

                                                                        <div className="fixed inset-0 overflow-y-auto">
                                                                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                                                                <Transition.Child
                                                                                    as={
                                                                                        Fragment
                                                                                    }
                                                                                    enter="ease-out duration-300"
                                                                                    enterFrom="opacity-0 scale-95"
                                                                                    enterTo="opacity-100 scale-100"
                                                                                    leave="ease-in duration-200"
                                                                                    leaveFrom="opacity-100 scale-100"
                                                                                    leaveTo="opacity-0 scale-95"
                                                                                >
                                                                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                                                                        {cards.length >
                                                                                        0 ? (
                                                                                            <>
                                                                                                <Dialog.Title
                                                                                                    as="h3"
                                                                                                    className="text-lg font-medium leading-6 text-gray-900"
                                                                                                >
                                                                                                    {
                                                                                                        subject.name
                                                                                                    }
                                                                                                </Dialog.Title>
                                                                                                <div className="mt-2">
                                                                                                    <p className="text-sm text-gray-500">
                                                                                                        {
                                                                                                            cards[
                                                                                                                index
                                                                                                            ]
                                                                                                        }
                                                                                                    </p>
                                                                                                </div>

                                                                                                <div className="mt-4 flex gap-4">
                                                                                                    {index >
                                                                                                        0 && (
                                                                                                        <button
                                                                                                            type="button"
                                                                                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                                                                            onClick={() =>
                                                                                                                setIndex(
                                                                                                                    index -
                                                                                                                        1
                                                                                                                )
                                                                                                            }
                                                                                                        >
                                                                                                            Prev
                                                                                                        </button>
                                                                                                    )}

                                                                                                    {index <
                                                                                                        cards.length -
                                                                                                            1 && (
                                                                                                        <button
                                                                                                            type="button"
                                                                                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                                                                            onClick={() =>
                                                                                                                setIndex(
                                                                                                                    index +
                                                                                                                        1
                                                                                                                )
                                                                                                            }
                                                                                                        >
                                                                                                            Next
                                                                                                        </button>
                                                                                                    )}
                                                                                                </div>
                                                                                            </>
                                                                                        ) : (
                                                                                            <>
                                                                                                <Dialog.Title
                                                                                                    as="h3"
                                                                                                    className="text-lg font-medium leading-6 text-gray-900"
                                                                                                >
                                                                                                    No
                                                                                                    Lecture
                                                                                                    selected
                                                                                                </Dialog.Title>
                                                                                                <div className="mt-2">
                                                                                                    <p className="text-sm text-gray-500">
                                                                                                        Default
                                                                                                        State
                                                                                                        of
                                                                                                        Card.
                                                                                                        Click
                                                                                                        on
                                                                                                        any
                                                                                                        of
                                                                                                        the
                                                                                                        lectures
                                                                                                        to
                                                                                                        pop
                                                                                                        flash
                                                                                                        cards.
                                                                                                    </p>
                                                                                                </div>

                                                                                                <div className="mt-4">
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                                                                        onClick={
                                                                                                            closeModal
                                                                                                        }
                                                                                                    >
                                                                                                        Got
                                                                                                        it,
                                                                                                        thanks!
                                                                                                    </button>
                                                                                                </div>
                                                                                            </>
                                                                                        )}
                                                                                    </Dialog.Panel>
                                                                                </Transition.Child>
                                                                            </div>
                                                                        </div>
                                                                    </Dialog>
                                                                </Transition>
                                                            </>
                                                        </div>
                                                    )}
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default Dashboard;
