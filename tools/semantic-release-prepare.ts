/*
 * Copyright (c) 2020 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of the GNU Affero General Public License v3.0.
 * You should have received a copy of the GNU Affero General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 *
 */

const path = require('path');
const { fork } = require('child_process');
const colors = require('colors');

const { readFileSync, writeFileSync } = require('fs');
const pkg = JSON.parse(readFileSync(path.resolve(__dirname, '..', 'package.json')));

pkg.scripts.prepush = 'npm run test:prod && npm run build';
pkg.scripts.commitmsg = 'commitlint -E HUSKY_GIT_PARAMS';

writeFileSync(path.resolve(__dirname, '..', 'package.json'), JSON.stringify(pkg, null, 2));

// Call husky to set up the hooks
fork(path.resolve(__dirname, '..', 'node_modules', 'husky', 'lib', 'installer', 'bin'), [
  'install',
]);

console.log();
console.log(colors.green('Done!!'));
console.log();

if (pkg.repository.url.trim()) {
  console.log(colors.cyan('Now run:'));
  console.log(colors.cyan('  npm install -g semantic-release-cli'));
  console.log(colors.cyan('  semantic-release-cli setup'));
  console.log();
  console.log(colors.cyan('Important! Answer NO to "Generate travis.yml" question'));
  console.log();
  console.log(
    colors.gray('Note: Make sure "repository.url" in your package.json is correct before'),
  );
} else {
  console.log(colors.red('First you need to set the "repository.url" property in package.json'));
  console.log(colors.cyan('Then run:'));
  console.log(colors.cyan('  npm install -g semantic-release-cli'));
  console.log(colors.cyan('  semantic-release-cli setup'));
  console.log();
  console.log(colors.cyan('Important! Answer NO to "Generate travis.yml" question'));
}

console.log();
