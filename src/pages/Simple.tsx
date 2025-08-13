import { useState } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Terminal } from '@/components/Terminal';
import { Editor } from '@/components/Editor';
import { StatusBar } from '@/components/StatusBar';
import { CommandPalette } from '@/components/CommandPalette';
import { TabBar } from '@/components/TabBar';
import { BootSequence } from '@/components/BootSequence';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateFileStructure, getFileContent, getFileUrl } from '@/utils/fileDiscovery';

const Simple = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [showMorseHint, setShowMorseHint] = useState(false);
  const [morseCode, setMorseCode] = useState('');
  const [decodedText, setDecodedText] = useState('');
  const [showCaesarHint, setShowCaesarHint] = useState(false);
  const [cipherText, setCipherText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [rotation, setRotation] = useState(13);
  const navigate = useNavigate();

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  if (showLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  const morseAlphabet = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..',
    '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
    '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
    ', ': '--..--', '.': '.-.-.-', '?': '..--..', '/': '-..-.', '-': '-....-',
    '(': '-.--.', ')': '-.--.-'
  };

  const caesarCipher = (text: string, shift: number) => {
    return text.split('').map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        let shiftedCode = code;

        if (char >= 'a' && char <= 'z') {
          shiftedCode = ((code - 97 + shift) % 26) + 97;
        } else if (char >= 'A' && char <= 'Z') {
          shiftedCode = ((code - 65 + shift) % 26) + 65;
        }

        return String.fromCharCode(shiftedCode);
      }
      return char;
    }).join('');
  };

  const decodeMorse = () => {
    const reversedMorseAlphabet: { [key: string]: string } = Object.fromEntries(
      Object.entries(morseAlphabet).map(([key, value]) => [value, key])
    );

    const words = morseCode.split(' / ');
    let decoded = '';

    for (const word of words) {
      const letters = word.split(' ');
      for (const letter of letters) {
        if (reversedMorseAlphabet[letter]) {
          decoded += reversedMorseAlphabet[letter];
        } else {
          decoded += '?';
        }
      }
      decoded += ' ';
    }

    setDecodedText(decoded.trim());

    if (decoded.trim().toLowerCase() === 'terminal') {
      setTimeout(() => {
        navigate('/terminal');
      }, 500);
    }
  };

  const decryptCaesar = () => {
    const decrypted = caesarCipher(cipherText, rotation);
    setDecryptedText(decrypted);

    if (decrypted.toLowerCase() === 'morse') {
      setShowMorseHint(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Simple Portfolio View</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <p>This is a simplified view of my portfolio.</p>
                <p>
                  Sometimes, simplicity is key. Here, you'll find a more direct
                  approach to understanding my skills and projects.
                </p>
                <ul className="list-disc space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">→</span>
                    <span>
                      Direct access to key projects and contact information.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">→</span>
                    <span>
                      A streamlined experience, focusing on essential details.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">→</span>
                    <span>
                      Hidden clues and easter eggs for the curious minds.
                    </span>
                  </li>
                </ul>
                <p>
                  If you're up for a challenge, try decoding the hidden messages
                  below. They might lead you to something interesting...
                </p>
              </div>
              <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <p className="text-gray-900">
                  Morse Code Decoder:
                </p>
                <input
                  type="text"
                  placeholder="Enter Morse code"
                  value={morseCode}
                  onChange={(e) => setMorseCode(e.target.value)}
                  className="mt-2 px-4 py-2 w-full border rounded-md text-gray-700 focus:ring focus:ring-blue-300 focus:outline-none"
                />
                <button
                  onClick={decodeMorse}
                  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                >
                  Decode
                </button>
                {decodedText && (
                  <p className="mt-3 text-gray-900">
                    Decoded Text: {decodedText}
                  </p>
                )}
                {showMorseHint && (
                  <p className="mt-3 text-green-500">
                    Hint: Try using the terminal.
                  </p>
                )}
              </div>
              <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <p className="text-gray-900">
                  Caesar Cipher Decoder:
                </p>
                <input
                  type="text"
                  placeholder="Enter cipher text"
                  value={cipherText}
                  onChange={(e) => setCipherText(e.target.value)}
                  className="mt-2 px-4 py-2 w-full border rounded-md text-gray-700 focus:ring focus:ring-blue-300 focus:outline-none"
                />
                <div className="mt-2 flex items-center">
                  <label htmlFor="rotation" className="mr-2 text-gray-900">Rotation:</label>
                  <input
                    type="number"
                    id="rotation"
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="px-2 py-1 w-20 border rounded-md text-gray-700 focus:ring focus:ring-blue-300 focus:outline-none"
                  />
                </div>
                <button
                  onClick={decryptCaesar}
                  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                >
                  Decrypt
                </button>
                {decryptedText && (
                  <p className="mt-3 text-gray-900">
                    Decrypted Text: {decryptedText}
                  </p>
                )}
                {showCaesarHint && (
                  <p className="mt-3 text-green-500">
                    Hint: The next step is in the terminal.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simple;
