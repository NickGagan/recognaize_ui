





const RECOGNIZE_AI_MESSAGE = `Recognize.ai is a state-of-the-art AI application built to help those potentially struggling with their mental health. Recently, it has flagged a post of yours with those signs and we want to help.
You are not alone. Helplines, also known as hotlines, exist to provide a confidential, non-judgemental space – for free. They are staffed by supportive people, who provide immediate support, counselling and resources. Help is available, speak to someone today:

National Suicide Prevention Lifeline http://www.suicidepreventionlifeline.org Phone: 1 800 273 TALK (8255)

Kids Help Phone (for youth under 20) Phone: 1 (800) 668-6868

Befrienders http://www.befrienders.org`;
const RECOGNIZE_AI_RESOURCES = `Recognize.ai is a state-of-the-art AI application built to help those potentially struggling with their mental health.

You are not alone. Helplines, also known as hotlines, exist to provide a confidential, non-judgemental space – for free. They are staffed by supportive people, who provide immediate support, counselling and resources. Help is available, speak to someone today:

Kids Help Phone (for youth under 20) Phone: 1-(800) 668-6868
`;

const RECOGNIZE_AI_MODEL_DESC = `This application leverages the fastText model: a lightweight library that is able to classify text.

FastText is another word embedding method that is an extension of the word2vec model. Instead of learning vectors for words directly, fastText represents each word as an n-gram of characters.

This helps capture the meaning of shorter words and allows the embeddings to understand suffixes and prefixes. Once the word has been represented using character n-grams, a skip-gram model is trained to learn the embedding.

The preprocessing steps include: Removing stopwords, lemmatization, removing any non alphabetic characters, and other common text preprocessing methods.

FastText was not the highest performing model, however it was chosen due to Heroku deployment memory limitations. The results are as follows:
Accuracy: 89.76%
Recall: 92.51%
Precision: 86.53%
F1-score: 89.42%

The highest performing model was an XL-Net Random Forest ensemble model with these results:
Accuracy: 97.22%
Recall: 93.32%
Precision: 90.26%
F1-score: 91.76%

For more information, read our full report: 
`;
export {
    RECOGNIZE_AI_MESSAGE,
    RECOGNIZE_AI_RESOURCES,
    RECOGNIZE_AI_MODEL_DESC
}