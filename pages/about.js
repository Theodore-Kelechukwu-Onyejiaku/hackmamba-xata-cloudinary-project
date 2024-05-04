import React from 'react';

export default function About() {
  return (
    <div className="mx-5 dark:text-white text-left dark:bg-dark">
      <h1 className="my-10 text-xl md:text-3xl font-bold"> Hi, Welcome to HackFlashC!</h1>
      <div>
        <p className="p-5 dark:bg-slate-900 text-center my-5">HackFlashC is a flashcard memorization app for developers, students, teachers, and for everyone for use of learning and memorization.</p>
        <p className="my-5">For example: you can use it to memorize Big0 Notation algorithms</p>

        <h2 className="mt-10 mb-3 text-lg font-bold">With HackFlashC, you can do the following:</h2>
        <ul className="list-disc space-y-5 mx-5">
          <li>
            Create a card
          </li>
          <li>Add an image to help you memorize</li>
          <li>
            Optionally add a video to help you memorize what you want to learn.
          </li>
          <li>
            Add a front content that tends to ask a question.
          </li>
          <li>
            Lastly, add a back content that answers the question.
          </li>
        </ul>
        <div>
          Built by
          {' '}
          <a href="https://www.linkedin.com/in/theodore-k-o/">Theodore Kelechukwu Onyejiaku </a>

          <p>
            <span>Leave a star if you like it 😊 </span>
            <a href="https://github.com/Theodore-Kelechukwu-Onyejiaku/hackmamba-xata-cloudinary-project">Github Link</a>
          </p>
        </div>
      </div>
    </div>
  );
}
